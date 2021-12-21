describe("setIcon() Should ", () => {
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

    Array.from([["svg", iconForTestingAsSVG], ["url", iconForTestingAsURL]]).forEach(([iconType, iconForTesting]) => {
        it(`set the icon when the icon is a ${iconType}`, async () => {
            await workspace.setIcon(iconForTesting);
            const icon = await workspace.getIcon();

            expect(icon).to.be.eql(iconForTesting);
        });

        it(`set the icon when the icon is a ${iconType} and the workspace is pinned`, async () => {
            await workspace.pin("neutralIcon");
            await workspace.setIcon(iconForTesting);
            const icon = await workspace.getIcon();

            expect(icon).to.be.eql(iconForTesting);
        });
    });

});