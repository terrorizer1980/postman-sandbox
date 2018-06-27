var sdk = require('postman-collection'),
    Sandbox = require('../../lib'),
    expect = require('chai').expect;

describe('pm api variables', function () {
    this.timeout(1000 * 60);

    it('should have tracking enabled by default', function (done) {
        Sandbox.createContext({debug: true}, function (err, ctx) {
            if (err) { return done(err); }

            ctx.execute(`
                var assert = require('assert');
                assert.equal(pm.variables._postman_enableTracking, true);
                assert.equal(pm.environment._postman_enableTracking, true);
                assert.equal(pm.globals._postman_enableTracking, true);
            `, done);
        });
    });

    it('should bubble mutations in result', function (done) {
        Sandbox.createContext({debug: true}, function (err, ctx) {
            if (err) { return done(err); }

            ctx.execute(`
                var assert = require('assert');
                pm.variables.set('foo', '_variable');
                pm.environment.set('foo', 'environment');
                pm.globals.set('foo', 'global');
            `, function (err, result) {
                if (err) {
                    return done(err);
                }

                expect(result._variables.mutations).to.be.ok;
                expect(new sdk.MutationTracker(result._variables.mutations).count()).to.equal(1);
                expect(result.environment.mutations).to.be.ok;
                expect(new sdk.MutationTracker(result.environment.mutations).count()).to.equal(1);
                expect(result.globals.mutations).to.be.ok;
                expect(new sdk.MutationTracker(result.globals.mutations).count()).to.equal(1);

                done();
            });
        });
    });
});
