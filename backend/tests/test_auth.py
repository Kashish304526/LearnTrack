import pytest

@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post(
        "/auth/register",
        json={"email": "new@test.com", "password": "password123"},
        follow_redirects=False,
    )

    assert response.status_code in (200, 201)


@pytest.mark.asyncio
async def test_register_duplicate_user(client):
    payload = {
        "email": "dup@test.com",
        "password": "password123",
    }

    await client.post("/auth/register", json=payload)

    with pytest.raises(Exception):
        await client.post("/auth/register", json=payload)


@pytest.mark.asyncio
async def test_login_success(client):
    email = "login@test.com"
    password = "password123"

    await client.post(
        "/auth/register",
        json={"email": email, "password": password},
    )

    response = await client.post(
        "/auth/login",
        data={"username": email, "password": password},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()



@pytest.mark.asyncio
async def test_login_invalid_password(client):
    response = await client.post(
        "/auth/login",
        json={"email": "fake@test.com", "password": "123"},  # ❌ < 6 chars
    )

    assert response.status_code == 422
