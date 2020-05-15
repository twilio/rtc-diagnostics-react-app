import { handler } from '../../../functions/twiml/record';

describe('the record TwiML function', () => {
  it('should "render" the correct TwiML', () => {
    const mockCallback = jest.fn();
    handler({ DOMAIN_NAME: 'mock-domain.com' }, {}, mockCallback);

    expect(mockCallback.mock.calls[0][1].toString()).toMatchInlineSnapshot(
      `"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><Response><Say>Record a message in 3, 2, 1</Say><Record maxLength=\\"3\\" action=\\"https://mock-domain.com/twiml/play\\"/><Say>Did not detect a message to record</Say></Response>"`
    );
  });
});
