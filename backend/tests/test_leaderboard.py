import pytest

@pytest.mark.asyncio
async def test_leaderboard_success(client, auth_headers):
    response = await client.get(
        "/leaderboard/",
        headers=auth_headers,
        follow_redirects=False,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
