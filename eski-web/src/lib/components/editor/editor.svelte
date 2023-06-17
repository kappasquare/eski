<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    import { json } from "@codemirror/lang-json";
    import { javascript } from "@codemirror/lang-javascript";

    export let content = "";
    export let lang: "js" | "json" = "json";
</script>

<CodeMirror bind:value={content} lang={lang == "js" ? javascript() : json()} />
