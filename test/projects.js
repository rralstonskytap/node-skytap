var chai      = require('chai')
  , expect    = chai.expect
  , Skytap    = require('../lib/skytap')
  , nockspect = require('./util/nockspect')
  , _         = require('underscore');

describe('Skytap.projects', function () {
  var skytap = Skytap.init({ username: 'foo', token: 'bar' });

  describe('.list', function () {
    it('requests a list of projects', function () {
      return nockspect(function (nock) {
        nock.get('/projects').reply(200);
        return _.bind(skytap.projects.list, skytap.projects);
      });
    });

    it('takes optional parameters', function () {
      return nockspect(function (nock) {
        nock.get('/projects?foo=bar').reply(200);
        return _.bind(skytap.projects.list, skytap.projects, {
          foo: 'bar'
        });
      });
    });
  });

  describe('.get', function () {
    it('requests project details', function () {
      return nockspect(function (nock) {
        nock.get('/projects/1').reply(200);
        return _.bind(skytap.projects.get, skytap.projects, {
          project_id: 1
        });
      });
    });
  });

  describe('.templates', function () {
    it('requests templates associated with a project', function () {
      return nockspect(function (nock) {
        nock.get('/projects/1/templates').reply(200);
        return _.bind(skytap.projects.templates, skytap.projects, {
          project_id: 1
        });
      });
    });
  });

  describe('.environments', function () {
    it('requests environments associated with a project', function () {
      return nockspect(function (nock) {
        nock.get('/projects/1/configurations').reply(200);
        return _.bind(skytap.projects.environments, skytap.projects, {
          project_id: 1
        });
      });
    });
  });

  describe('.addEnvironment', function () {
    it('requests to add an environment to a project', function () {
      return nockspect(function (nock) {
        nock.post('/projects/1/configurations/2').reply(200);
        return _.bind(skytap.projects.addEnvironment, skytap.projects, {
          project_id: 1,
          configuration_id: 2
        });
      });
    });
  });

  describe('.removeEnvironment', function () {
    it('requests to remove an environment from a project', function () {
      return nockspect(function (nock) {
        nock.delete('/projects/1/configurations/2').reply(200);
        return _.bind(skytap.projects.removeEnvironment, skytap.projects, {
          project_id: 1,
          configuration_id: 2
        });
      });
    });
  });

  describe('.addTemplate', function () {
    it('requests to add a template to a project', function () {
      return nockspect(function (nock) {
        nock.post('/projects/1/templates/2').reply(200);
        return _.bind(skytap.projects.addTemplate, skytap.projects, {
          project_id: 1,
          template_id: 2
        });
      });
    });
  });

  describe('.removeTemplate', function () {
    it('requests to remove a template from a project', function () {
      return nockspect(function (nock) {
        nock.delete('/projects/1/templates/2').reply(200);
        return _.bind(skytap.projects.removeTemplate, skytap.projects, {
          project_id: 1,
          template_id: 2
        });
      });
    });
  });
});
