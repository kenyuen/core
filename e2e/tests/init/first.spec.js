describe("first ", function () {

    before(async () => await coreReady);

    it("case", () => {
        expect(1).to.eql(1);
    });

    it("gtf", () => {
        expect(gtf.puppet).to.not.be.undefined;
    });

    it("try it", (done) => {
        gtf.puppet.startDesktopGateway()
            .then((gw) => gtf.puppet.stopDesktopGateway(gw))
            .then(() => done())
            .catch(done);
    });
});

// start a GW -> stop the gateway
// start a Platform
    // close the platform
// start a Client (Core or Web)
    // close the client

// define a web app to be started in every occasion when called from gtf.puppet
// app:
// on load -> creates an id for itself and a message channel -> sends to it's parent 
// the port reaches the runner
// the runner then sends commands -> init GlueWeb, init GlueWebPlatform, init GlueCore with config (as flags -> enable wsp or a plugin)
