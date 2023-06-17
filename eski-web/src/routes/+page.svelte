<script lang="ts">
    import Editor from "../lib/components/editor/editor.svelte";
    import {
        Card,
        Paper,
        Button,
        Input,
        Tabs,
        Badge,
        type SvelteUIColor,
    } from "@svelteuidev/core";
    import EskiServer from "@kappasquare/eski";

    var port: number = 3000;
    var content = "";

    var started: boolean = false;
    var starting: boolean = false;

    const toggleServer = async () => {
        starting = true;
        await new Promise((r) => setTimeout(r, 2000));
        if (!started) {
        } else {
            const eski = new EskiServer({
                port,
                routes_configuration: { json: content },
            });
            eski.start();
            eski.on("started", ({ port }) => {
                console.log(port);
            });
        }
        started = !started;
        starting = false;
    };

    const logs: {
        type: "info" | "error" | "warn" | "success";
        message: string;
    }[] = [
        { type: "info", message: `Successfully Started server!` },
        { type: "success", message: `Successfully Started server!` },
        { type: "warn", message: `Successfully Started server!` },
        { type: "error", message: `Successfully Started server!` },
    ];

    const getLogBadgeColor = (
        type: "info" | "error" | "warn" | "success"
    ): SvelteUIColor => {
        switch (type) {
            case "info":
                return "blue";
            case "error":
                return "red";
            case "success":
                return "green";
            case "warn":
                return "orange";
        }
    };
</script>

<div class="flex flex-row h-full min-h-full w-full min-w-full">
    <div class="flex-1">
        <Card
            ><Tabs>
                <Tabs.Tab label="Builder" />
                <Tabs.Tab label="JSON"><Editor bind:content /></Tabs.Tab>
            </Tabs>
        </Card>
    </div>
    <div class="flex-1 flex-col h-full p-2 space-y-2">
        <div class="h-[30px] flex flex-row items-center justify-between">
            <div />
            <div class="flex flex-row space-x-2 font-normal items-center">
                <span class="opacity-50"
                    >{started && !starting
                        ? "Server running on port"
                        : ""}</span
                >
                <div
                    class="w-16 flex flex-row flex-nowrap items-center space-x-2"
                >
                    <Input placeholder="Port" bind:value={port} />
                </div>
                {#if starting}
                    <Button color="gray" variant="filled" loading
                        >{`${started ? "Stopping" : "Starting"} server...`}
                    </Button>
                {:else}
                    <Button
                        on:click={toggleServer}
                        color={started ? "red" : "green"}
                        variant="light"
                        >{started ? "Stop" : "Start"}
                    </Button>
                {/if}
            </div>
        </div>
        <div class="flex-1 rounded-sm flex-col space-y-2">
            {#each logs as log}
                <Paper
                    class="flex flex-row space-x-2 hover:opacity-50 cursor-pointer"
                >
                    <Badge radius="sm" color={getLogBadgeColor(log.type)}
                        >{log.type.toUpperCase()}</Badge
                    >
                    <span>{log.message}</span>
                </Paper>
            {/each}
        </div>
    </div>
</div>
