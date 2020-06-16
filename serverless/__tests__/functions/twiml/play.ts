import { handler } from '../../../functions/twiml/play';

describe('the "play" TwiML function', () => {
  it('should render the correct TwiML', () => {
    const mockCallback = jest.fn();
    handler({}, { RecordingUrl: 'testurl.com/recording' }, mockCallback);
    expect(mockCallback.mock.calls[0][1].toString()).toMatchInlineSnapshot(
      `"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><Response><Say>You said:</Say><Play loop=\\"1\\">testurl.com/recording</Play><Say>Now waiting for a few seconds to gather audio performance metrics.</Say><Pause length=\\"3\\"/><Say>Hanging up now.</Say></Response>"`
    );
  });
});
