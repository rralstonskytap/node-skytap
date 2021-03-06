var chai      = require('chai')
  , expect    = chai.expect
  , Skytap    = require('../lib/skytap')
  , nockspect = require('./util/nockspect')
  , _         = require('underscore');

describe('Skytap.networks', function () {
  var skytap = Skytap.init({ username: 'foo', token: 'bar' });

  describe('.list', function () {
    it('requests a list of networks associated with a template', function () {
      return nockspect(function (nock) {
        nock.get('/templates/1/networks').reply(200);
        return _.bind(skytap.networks.list, skytap.networks, {
          template_id: 1
        });
      });
    });

    it('requests a list of networks associated with an environment', function () {
      return nockspect(function (nock) {
        nock.get('/configurations/1/networks').reply(200);
        return _.bind(skytap.networks.list, skytap.networks, {
          configuration_id: 1
        });
      });
    });

    // it('requires an environment or template id', function () {
    //   return nockspect(function (nock) {
    //     return _.bind(skytap.networks.list, skytap.networks, {
    //       foo: 'bar'
    //     });
    //   }).catch(function (err) {
    //     expect(err).to.equal('foo');
    //   });
    // });
  });

  describe('.get', function () {
    it('requests a network associated with a template', function () {
      return nockspect(function (nock) {
        nock.get('/templates/1/networks/2').reply(200);
        return _.bind(skytap.networks.get, skytap.networks, {
          template_id: 1,
          network_id: 2
        });
      });
    });

    it('requests a network associated with an environment', function () {
      return nockspect(function (nock) {
        nock.get('/configurations/1/networks/2').reply(200);
        return _.bind(skytap.networks.get, skytap.networks, {
          configuration_id: 1,
          network_id: 2
        });
      });
    });
  });

  describe('.update', function () {
    var body = {
      network_info: {
        foo: 'bar'
      }
    };

    it('requests to update a network associated with a template', function () {
      return nockspect(function (nock) {
        nock.put('/templates/1/networks/2', body).reply(200);
        return _.bind(skytap.networks.update, skytap.networks, _.extend({
          template_id: 1,
          network_id: 2
        }, body));
      });
    });

    it('requests to update a network associated with an environment', function () {
      return nockspect(function (nock) {
        nock.put('/configurations/1/networks/2', body).reply(200);
        return _.bind(skytap.networks.update, skytap.networks, _.extend({
          configuration_id: 1,
          network_id: 2
        }, body));
      });
    });
  });
});
