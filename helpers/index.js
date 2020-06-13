const endRequest = (eventEmitter, requestNumber) => {
  eventEmitter.emit(`end-${requestNumber}`);
};

const listenToCallback = (eventEmitter, requestNumber) => {
  return new Promise((resolve) => {
    eventEmitter.once(`end-${requestNumber}`, () => {
      resolve();
    });
  });
};

module.exports = { endRequest, listenToCallback };
