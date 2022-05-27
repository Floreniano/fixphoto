export async function request(url, method, body = null) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://fixphoto.zodiak-elektro.ru/api/${url}`, {
      method,
      body: body === null ? null : JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    /* eslint-disable no-console */
    return console.warn('ERROR ', error);
  }
}
