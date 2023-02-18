/* eslint-disable camelcase, no-shadow */

const _ = require('lodash');
const Promise = require('bluebird');
const {
  StatusBuilder, ListenerBuilder, InterceptingCall, RequesterBuilder, status: Statuses
} = require('@grpc/grpc-js');

const CallRegistry = function (callback, expectation, is_ordered, is_verbose) {
  this.call_map = {};
  this.call_array = [];
  this.done = callback;
  this.expectation = expectation;
  this.expectation_is_array = Array.isArray(this.expectation);
  this.is_ordered = is_ordered;
  this.is_verbose = is_verbose;
  if (is_verbose) {
    console.warn('Expectation: ', expectation);
  }
};

CallRegistry.prototype.addCall = function (call_name) {
  if (this.expectation_is_array) {
    this.call_array.push(call_name);
    if (this.is_verbose) {
      console.debug(this.call_array);
    }
  } else {
    if (!this.call_map[call_name]) {
      this.call_map[call_name] = 0;
    }
    this.call_map[call_name] += 1;
    if (this.is_verbose) {
      console.debug(this.call_map);
    }
  }
  this.maybeCallDone();
};

CallRegistry.prototype.maybeCallDone = function () {
  if (this.expectation_is_array) {
    if (this.is_ordered) {
      if (this.expectation && _.isEqual(this.expectation, this.call_array)) {
        this.done();
      }
    } else {
      const relates = _.intersectionWith(
        this.expectation,
        this.call_array,
        _.isEqual
      );

      if (_.intersectionWith(relates, ['foo_result', 'bar_result']).length) {
        this.done();
      }
    }
  } else if (this.expectation && _.isEqual(this.expectation, this.call_map)) {
    this.done();
  }
};

module.exports = function Initializer(
  {
    config,
    interval = 3000, maxTrying = 10,
    isOrdered = false, isVerbose = false
  },
  callback
) {
  const opts = {
    config: `${config.host}/${config.name}.${config.service}(${config.proto})`,
    interval,
    maxTrying,
    callback
  }

  opts.callback = opts.callback || function () {
    console.log(`Try to reach grpc=${opts.config} has been done; with got the expected response`)
  }

  const expectations = [];
  for (let i = 1; i <= maxTrying; i++) expectations.push(`retry_foo_${i}`)
  expectations.push('foo_result')
  for (let i = 1; i <= maxTrying; i++) expectations.push(`retry_bar_${i}`)
  expectations.push('bar_result')

  const Registry = new CallRegistry(opts.callback, expectations, isOrdered, isVerbose);

  const Interceptor = function (options, nextCall) {
    let savedMetadata;
    let savedSendMessage;
    let savedReceiveMessage;
    let savedMessageNext;
    const requester = (new RequesterBuilder())
      .withStart((metadata, listener, next) => {
        savedMetadata = metadata;
        const new_listener = (new ListenerBuilder())
          .withOnReceiveMessage((message, next) => {
            savedReceiveMessage = message;
            savedMessageNext = next;
          })
          .withOnReceiveStatus((status, next) => {
            let retries = 0;
            const retry = function (message, metadata) {
              retries += 1;
              const newCall = nextCall(options);
              let receivedMessage;
              newCall.start(metadata, {
                onReceiveMessage(message) {
                  receivedMessage = message;
                },
                async onReceiveStatus(status) {
                  await Promise.delay(opts.interval);

                  console.warn(`Try to reach grpc=${opts.config}; interval=${opts.interval / 1000}s; retries=${retries}/${opts.maxTrying}`);
                  Registry.addCall(`retry_${savedMetadata.get('name')[0] || 'foo'}_${retries}`);
                  if (status.code !== Statuses.OK) {
                    if (retries < opts.maxTrying) {
                      retry(message, metadata);
                    } else {
                      savedMessageNext(receivedMessage);
                      next(status);
                    }
                  } else {
                    Registry.addCall(`${savedMetadata.get('name')[0] || 'foo'}_result`);
                    const new_status = (new StatusBuilder()).withCode(Statuses.OK).build();
                    savedMessageNext(receivedMessage);
                    next(new_status);
                  }
                }
              });
              newCall.sendMessage(message);
              newCall.halfClose();
            };
            if (status.code !== Statuses.OK) {
              // Change the message we're sending only for test purposess
              // so the server will respond without error
              const newMessage = (savedMetadata.get('name')[0] === 'bar')
                ? { value: 'bar' } : savedSendMessage;
              retry(newMessage, savedMetadata);
            } else {
              savedMessageNext(savedReceiveMessage);
              next(status);
            }
          })
          .build();
        next(metadata, new_listener);
      })
      .withSendMessage((message, next) => {
        savedSendMessage = message;
        next(message);
      }).build();
    return new InterceptingCall(nextCall(options), requester);
  };

  return Interceptor
};
