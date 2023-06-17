<script>
    import NavBar from "$lib/components/common/nav-bar.svelte";
    import "../app.css";
</script>

<div class="text-sm flex flex-col w-full h-full min-w-full max-h-full space-y-2">
    <NavBar />
    <div>
        <slot />
    </div>
</div>
