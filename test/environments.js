var chai      = require('chai')
  , expect    = chai.expect
  , Skytap    = require('../lib/skytap')
  , nockspect = require('./util/nockspect')
  , _         = require('underscore');

describe('Skytap.environments', function () {
  var skytap = Skytap.init({ username: 'foo', token: 'bar' });

  describe('.list', function () {
    it('requests a list of environments', function () {
      return nockspect(function (nock) {
        nock.get('/configurations').reply(200);
        return _.bind(skytap.environments.list, skytap.environments);
      });
    });

    it('takes optional parameters', function () {
      return nockspect(function (nock) {
        nock.get('/configurations?foo=bar').reply(200);
        return _.bind(skytap.environments.list, skytap.environments, {
          foo: 'bar'
        });
      });
    });
  });

  describe('.get', function () {
    it('requests to get an environment', function () {
      return nockspect(function (nock) {
        var envId = 1;

        nock.get('/configurations/' + envId).reply(200);
        return _.bind(skytap.environments.get, skytap.environments, {
          configuration_id: envId
        });
      });
    });
  });

  describe('.create', function () {
    it('requests to create an environment from a template', function () {
      return nockspect(function (nock) {
        var param = {
          template_id: 1
        };

        nock.post('/configurations', param).reply(200);
        return _.bind(skytap.environments.create, skytap.environments, param);
      });
    });
  });

  describe('.update', function () {
    it('requests to update an environment', function () {
      return nockspect(function (nock) {
        var param = {
          some_param: 'foo'
        };

        nock.put('/configurations/1', param).reply(200);
        return _.bind(skytap.environments.update, skytap.environments, _.extend({
          configuration_id: 1
        }, param));
      });
    });
  });

  describe('.del', function () {
    it('requests to delete an environment', function () {
      return nockspect(function (nock) {
        nock.delete('/configurations/1').reply(200);
        return _.bind(skytap.environments.del, skytap.environments, {
          configuration_id: 1
        });
      });
    });
  });

  describe('.start', function () {
    it('requests to start an environment', function () {
      return nockspect(function (nock) {
        nock.put('/configurations/1', { runstate: 'running' }).reply(200);
        return _.bind(skytap.environments.start, skytap.environments, {
          configuration_id: 1
        });
      });
    });
  });

  describe('.suspend', function () {
    it('requests to suspend an environment', function () {
      return nockspect(function (nock) {
        nock.put('/configurations/1', { runstate: 'suspended' }).reply(200);
        return _.bind(skytap.environments.suspend, skytap.environments, {
          configuration_id: 1
        });
      });
    });
  });

  describe('.stop', function () {
    it('requests to stop an environment', function () {
      return nockspect(function (nock) {
        nock.put('/configurations/1', { runstate: 'stopped'}).reply(200);
        return _.bind(skytap.environments.stop, skytap.environments, {
          configuration_id: 1
        });
      });
    });
  });

  describe('.waitForState', function () {
    var testFn = _.bind(skytap.environments.waitForState, skytap.environments, {
      configuration_id: 1,
      runstate: 'running'
    })
        // Note the odd '?runstate=running' at the end. node-skytap will append unrecognized parameters
        // to the uri, but this gets piped through since it simply makes a call to `env.get`. We may want to
        // shave this parameter off before calling `env.get`.
      , testUri = '/configurations/1?runstate=running';

    it('checks an environments runstate', function () {
      return nockspect(function (nock) {
        nock.get(testUri).reply(200, { runstate: 'running' });
        return testFn;
      });
    });

    it('polls for environment to start', function () {
      // Note: `waitForState` is currently hardcoded to wait 5s before trying again
      // We need a way to override this to make test run faster, but for now
      // just set timeout to a second or two longer
      // 2x5s + 2s pad time = 12,000ms  <>  `nockspect` does two tests in one, so we need double the time
      this.timeout(12000);
      return nockspect(function (nock) {
        nock
          .get(testUri).reply(200, { runstate: 'stopped' })
          .get(testUri).reply(200, { runstate: 'running' });

        return testFn;
      });
    });
  });

  describe('.userdata', function () {
    it('requests user data from an environment', function () {
      return nockspect(function (nock) {
        nock.get('/configurations/1/user_data').reply(200);
        return _.bind(skytap.environments.userdata, skytap.environments, {
          configuration_id: 1
        });
      });
    });
  });

  describe('.updateUserdata', function () {
    it('requests to update user data for an environment', function () {
      return nockspect(function (nock) {
        var userData = {
          foo: 'bar'
        };
        nock.put('/configurations/1/user_data', { contents: userData }).reply(200);
        return _.bind(skytap.environments.updateUserdata, skytap.environments, {
          configuration_id: 1,
          contents: userData
        });
      });
    });
  });

  describe('.all', function () {
    it('requests all available environments', function () {
      var user1envs = [ { name: 'foo' } ]
        , user2envs = [ { name: 'bar' }, { name: 'baz' } ];

      return nockspect(function (nock) {
        nock
          .get('/users').reply(200, [
            { id: 1 },
            { id: 2 }
          ])
          .get('/users/1').reply(200, { configurations: user1envs })
          .get('/users/2').reply(200, { configurations: user2envs });

        return _.bind(skytap.environments.all, skytap.environments);
      }, function (result) {
        expect(result).to.eql(user1envs.concat(user2envs));
      });
    });
  });
});
