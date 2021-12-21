describe("unpin() Should", () => {
    const iconForTesting = "icon";
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

    it("resolve", async () => {
        await workspace.pin(iconForTesting);
        await workspace.unpin();
        expect(workspace.isPinned).to.be.false;
    });

    it("do nothing when the workspace isn't pinned", async () => {
        await workspace.unpin();
        expect(workspace.isPinned).to.be.false;
    });

    it("unpin the workspace when it's locked", async () => {
        await workspace.pin(iconForTesting);
        await workspace.lock();
        await workspace.unpin();
        expect(workspace.isPinned).to.be.false;
    });

    it("unpin the workspace when it's empty", async () => {
        const emptyWorkspace = await glue.workspaces.createWorkspace(emptyConfig);

        await emptyWorkspace.pin(iconForTesting);
        await emptyWorkspace.unpin();

        expect(emptyWorkspace.isPinned).to.eql(false);
    });

    describe("", () => {
        beforeEach(async () => {
            await glue.workspaces.createWorkspace(basicConfig);
        });

        it("resolve when the workspace is not selected", async () => {
            await workspace.pin(iconForTesting);
            await workspace.unpin();
            expect(workspace.isPinned).to.be.false;
        });

        it("do nothing when the workspace isn't pinned and is not selected", async () => {
            await workspace.unpin();
            expect(workspace.isPinned).to.be.false;
        });

        it("unpin the workspace when it's locked and is not selected", async () => {
            await workspace.pin(iconForTesting);
            await workspace.lock();
            await workspace.unpin();
            expect(workspace.isPinned).to.be.false;
        });

        it("unpin the workspace when it's hibernated", async () => {
            await workspace.pin(iconForTesting);
            await workspace.hibernate();
            await workspace.unpin();
            expect(workspace.isPinned).to.be.false;
        });
    });
});