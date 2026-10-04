from routes import place_routes


def assert_json_error(response, status_code):
    assert response.status_code == status_code
    assert response.is_json

    body = response.get_json()
    assert body["status"] == "error"
    assert isinstance(body["message"], str) and body["message"]
    return body


def test_unknown_url_returns_json_404(client):
    response = client.get("/api/does-not-exist")

    assert_json_error(response, 404)


def test_wrong_method_returns_json_405(client):
    response = client.post("/api/places")

    assert_json_error(response, 405)


def test_unexpected_error_returns_json_500_without_details(client, monkeypatch):
    # Make the Places service crash so the route hits an unexpected error
    def crash(**kwargs):
        raise RuntimeError("secret internal detail")

    monkeypatch.setattr(place_routes, "get_places", crash)

    response = client.get("/api/places")

    body = assert_json_error(response, 500)
    assert body["message"] == "Something went wrong on our side"
    assert "secret internal detail" not in response.get_data(as_text=True)
