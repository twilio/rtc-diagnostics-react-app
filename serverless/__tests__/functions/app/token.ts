import { handler } from '../../../functions/app/token';
import jwt from 'jsonwebtoken'

const mockContext = {
  API_KEY: 'mockkey',
  API_SECRET: 'mocksecret',
  ACCOUNT_SID: 'mocksid',
  TWIML_APP_SID: 'mockappsid',
};

Date.now = () => 1589568597000;

describe('the token function', () => {
  it('should return a valid json web token', () => {
    const mockCallback = jest.fn();
    handler(mockContext, {}, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({ token: expect.any(String) }));

    const token = mockCallback.mock.calls[0][1].token;
    jwt.verify(token, mockContext.API_SECRET, (err: Error | null, decoded: Object) => {
      expect(decoded).toMatchInlineSnapshot(`
        Object {
          "exp": 1589568687,
          "grants": Object {
            "identity": "test-identity",
            "voice": Object {
              "outgoing": Object {
                "application_sid": "mockappsid",
              },
            },
          },
          "iat": 1589568597,
          "iss": "mockkey",
          "jti": "mockkey-1589568597",
          "sub": "mocksid",
        }
      `);
    });
  });
});
