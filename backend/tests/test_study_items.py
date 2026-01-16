import pytest

@pytest.mark.asyncio
async def test_create_study_item_success(client, auth_headers):
    response = await client.post(
        "/study-items/",
        json={"title": "DSA Practice", "type": "task"},
        headers=auth_headers,
        follow_redirects=False,
    )

    assert response.status_code in (200, 201)


@pytest.mark.asyncio
async def test_get_study_items(client, auth_headers):
    response = await client.get(
        "/study-items/",
        headers=auth_headers,
        follow_redirects=False,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
