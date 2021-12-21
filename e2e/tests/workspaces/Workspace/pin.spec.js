describe("pin() Should", () => {
    const iconForTesting = "icon";
    const iconForTesting2 = "icon2";

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

    it("resolve when the workspace is selected", async () => {
        await workspace.pin(iconForTesting);
        expect(workspace.isPinned).to.be.true;
    });

    it("resolve when the workspace is selected and locked", async () => {
        await workspace.lock();
        await workspace.pin(iconForTesting);
        expect(workspace.isPinned).to.be.true;
    });

    it("change the workspace icon", async () => {
        await workspace.pin(iconForTesting);
        const workspaceIcon = await workspace.getIcon();

        expect(workspaceIcon).to.eql(iconForTesting);
    });

    it("change the workspace icon when the workspace has already been pinned", async () => {
        await workspace.pin(iconForTesting2);
        await workspace.pin(iconForTesting);
        const workspaceIcon = await workspace.getIcon();

        expect(workspaceIcon).to.eql(iconForTesting);
    });

    it("resolve when the workspace is empty", async () => {
        const emptyWorkspace = await glue.workspaces.createWorkspace(emptyConfig);

        await emptyWorkspace.pin(iconForTesting);
        expect(emptyWorkspace.isPinned).to.be.true;
    });

    describe("", () => {
        beforeEach(async () => {
            await glue.workspaces.createWorkspace(basicConfig);
        });

        it("resolve when the workspace is not selected", async () => {
            await workspace.pin(iconForTesting);
            expect(workspace.isPinned).to.be.true;
        });

        it("resolve when the workspace is not selected and hibernated", async () => {
            await workspace.hibernate();
            await workspace.pin(iconForTesting);
            expect(workspace.isPinned).to.be.true;
        });

        it("resolve when the workspace is not selected and locked", async () => {
            await workspace.lock();
            await workspace.pin(iconForTesting);

            expect(workspace.isPinned).to.be.true;
        });
    });
});