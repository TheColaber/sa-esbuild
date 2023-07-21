<template>
  <div :class="$style.container">
    <Header></Header>
    <!--<Suspense>
      <Popups></Popups>
    </Suspense> -->
  </div>
</template>

<script setup lang="ts">
import Header from "./header.vue";
// import Popups from "./popups.vue";
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
}
</style>
