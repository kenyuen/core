describe("getIcon() Should ", () => {
    const iconForTestingAsSVG = "icon";
    const iconForTestingAsURL = "icon";
    const basicConfig = {
        children: [{
            type: "column",
            children: [{
                type: "row",
                children: [
                    {
                        type: "group",
                        children: [
                            {
                                type: "window",
                                appName: "noGlueApp"
                            }
                        ]
                    },
                    {
                        type: "group",
                        children: [
                            {
                                type: "window",
                                appName: "noGlueApp"
                            }
                        ]
                    },
                ],
            },
            {
                type: "group",
                children: [
                    {
                        type: "window",
                        appName: "noGlueApp"
                    }
                ]
            }]
        }]
    };

    const emptyConfig = {
        children: []
    }

    let workspace = undefined;

    before(async () => {
        await coreReady;
    });

    beforeEach(async () => {
        gtf.clearWindowActiveHooks();
        workspace = await glue.workspaces.createWorkspace(basicConfig);
    });

    afterEach(async () => {
        const wsps = await glue.workspaces.getAllWorkspaces();
        await Promise.all(wsps.map((wsp) => wsp.close()));
    });

    it("return undefined when the workspace doesn't have an icon", async () => {
        const icon = await workspace.getIcon();

        expect(icon).to.be.undefined;
    });

    it("return the icon when the icon is passed as a svg", async () => {
        await workspace.setIcon(iconForTestingAsSVG);

        const icon = await workspace.getIcon();

        expect(icon).to.eql(iconForTestingAsSVG);
    });

    it("return the icon when the icon is passed as an url", async () => {
        await workspace.setIcon(iconForTestingAsURL);
        const icon = await workspace.getIcon();

        expect(icon).to.eql(iconForTestingAsURL);
    });
});