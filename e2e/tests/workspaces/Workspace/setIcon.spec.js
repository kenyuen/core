describe("setIcon() Should ", () => {
    const iconForTestingAsSVG = `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 512 512'%3E%3Cpath
    d='M224 448v-96h64v96l-32 64zM336 224v-160c48 0 80-32 80-64v0 0h-320c0 32 32 64 80 64v160c-73.6 22.4-112 64-112 128h384c0-64-38.4-105.6-112-128z'%3E%3C/path%3E%3C/svg%3E%0A`;
    const iconForTestingAsURL = "http://localhost:3000/myIcon.svg";
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