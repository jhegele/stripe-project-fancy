import os
import stripe
from stripe.error import InvalidRequestError

from dotenv import load_dotenv
from flask import Flask, request, render_template, jsonify, session

load_dotenv()

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_PUB_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY")

if STRIPE_SECRET_KEY is None or STRIPE_PUB_KEY is None:
    raise Exception(
        "STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY must be set in .env file"
    )

stripe.api_key = STRIPE_SECRET_KEY

app = Flask(
    __name__,
    static_url_path="",
    template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), "views"),
    static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), "public"),
)
app.secret_key = "ThisIsASecretKey"

book_inventory = [
    {
        "id": "01921f97-d957-4b45-ac86-5a3db80ab658",
        "title": "The Art of Doing Science and Engineering",
        "author": "Richard Hamming",
        "description": "The Art of Doing Science and Engineering is a reminder that a childlike capacity for learning and creativity are accessible to everyone.",
        "amount": 2300,
        "image": "art-science-eng.jpg",
    },
    {
        "id": "54ba5277-4048-42c6-8961-3cd0900ca9a3",
        "title": "The Making of Prince of Persia: Journals 1985-1993",
        "author": "Jordan Mechner",
        "description": "In The Making of Prince of Persia, on the 30th anniversary of the game’s release, Mechner looks back at the journals he kept from 1985 to 1993.",
        "amount": 2500,
        "image": "prince-of-persia.jpg",
    },
    {
        "id": "88949ead-325d-4008-b0e3-7bc6632630cc",
        "title": "Working in Public: The Making and Maintenance of Open Source",
        "author": "Nadia Eghbal",
        "description": "Nadia Eghbal takes an inside look at modern open source and offers a model through which to understand the challenges faced by online creators.",
        "amount": 2800,
        "image": "working-in-public.jpg",
    },
]


def get_cart_total():
    print("DERP")
    return sum(
        [
            b["amount"] * session["cart"][b["id"]]["quantity"]
            for b in book_inventory
            if b["id"] in session["cart"]
        ]
    )


@app.route("/api/payment", defaults={"id": None}, methods=["POST"])
@app.route("/api/payment/finalize/<id>", methods=["GET"])
@app.route("/api/payment/<id>", methods=["PATCH"])
def payment_create(id):
    session["cart"] = session.get("cart", {})
    if request.method == "POST":
        amount = 0
        metadata = {}
        if len(session["cart"]) > 0:
            amount = get_cart_total()
            metadata = {k: v["quantity"] for k, v in session["cart"].items()}
        print("AMOUNT: ", amount)
        print("CART: ", session["cart"])
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            automatic_payment_methods={"enabled": True},
            metadata=metadata,
        )
        return jsonify(intent)
    if request.method == "PATCH":
        # prevent client side amount modifications
        amount = get_cart_total()
        intent = stripe.PaymentIntent.modify(
            id, amount=amount, metadata=session["cart"]
        )
        return jsonify(intent)
    if request.method == "GET":
        try:
            intent = stripe.PaymentIntent.retrieve(id)
            session["cart"] = {}
        except InvalidRequestError:
            return jsonify(None)
        return jsonify(intent)


@app.route("/api/cart", defaults={"book_id": None}, methods=["GET"])
@app.route("/api/cart/<book_id>", methods=["POST", "PATCH", "DELETE"])
def cart(book_id):
    session["cart"] = session.get("cart", {})
    if request.method == "GET":
        return jsonify(session["cart"])
    if request.method == "POST" or request.method == "PATCH":
        data = request.json
        session["cart"][book_id] = {"quantity": data["quantity"]}
        return jsonify(session["cart"])
    if request.method == "DELETE":
        if book_id in session["cart"]:
            updated = {k: v for k, v in session["cart"].items() if k != book_id}
            session["cart"] = updated
        return jsonify(session["cart"])
    return jsonify({"error": "An unexpected error occurred."}), 500


@app.route("/api/books", methods=["GET"])
def books():
    return jsonify(book_inventory)


# @app.route("/api/create-payment-intent", methods=["POST"])
# def create_payment_intent():
#     data = request.json()
#     intent = stripe.PaymentIntent.create()


@app.route("/reset", methods=["GET"])
def reset():
    session.clear()
    return jsonify({"reset": "Session data cleared"})


# Catch all route, all UI routing is handled by React Router
@app.route("/", defaults={"path": ""})
@app.route("/<string:path>")
@app.route("/<path:path>")
def ui_routes(path):
    return render_template("index.html")


if __name__ == "__main__":
    app.run(port=5000, host="0.0.0.0", debug=True)
