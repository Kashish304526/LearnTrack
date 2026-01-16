import pytest

@pytest.mark.asyncio
async def test_ai_assistant_success(client, auth_headers):
    response = await client.post(
        "/ai/ask",
        json={"question": "Explain React"},
        headers=auth_headers,
        follow_redirects=False,
    )

    assert response.status_code == 200
    assert "answer" in response.json()


@pytest.mark.asyncio
async def test_ai_assistant_empty_question(client, auth_headers):
    response = await client.post(
        "/ai/ask",
        json={"question": ""},
        headers=auth_headers,
        follow_redirects=False,
    )

    assert response.status_code in (422, 500)


