<template>
  <div :class="$style.setting">
    <div>{{ setting.name }}</div>
    <input
      v-if="setting.type === 'integer'"
      :class="$style.input"
      name="addon-setting"
      type="number"
      v-model="inputValue"
    />
    <div
      :class="$style.preset"
      v-if="setting.presets"
      v-on-click-outside="() => (showPresetsList = false)"
    >
      <button
        :class="$style.button"
        @click="showPresetsList = !showPresetsList"
      >
        <Icon :icon="chevronDown" :class="$style.icon" />
      </button>
      <div :class="[$style.list, { [$style.show]: showPresetsList }]">
        <button
          :class="$style.item"
          v-for="(val, id) of setting.presets"
          @click="(inputValue = val), (showPresetsList = false)"
        >
          {{ id === "default" ? "Default" : presetNames[id] }}
          <span :class="$style.value">{{ val }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import chevronDown from "@iconify-icons/tabler/chevron-down";
import { ExtraAddonManifest } from "../../../../esbuild/addon-helpers";
import { ref, watch } from "vue";
import { vOnClickOutside } from "@vueuse/components";

const { setting, presetNames, value } = defineProps<{
  setting: ExtraAddonManifest["settings"][number];
  presetNames: ExtraAddonManifest["presetNames"];
  value: string | number;
}>();
const inputValue = ref(value);
const emit = defineEmits(["update:value"]);
watch(inputValue, (val) => {
  emit("update:value", val);
});

const showPresetsList = ref(false);
</script>

<style lang="scss" module>
.setting {
  display: flex;
  .input {
    width: 70px;
    background: var(--background-tertiary);
    border: none;
    border-radius: 8px 0px 0px 8px;
    color: var(--content-text);
  }
  .preset {
    position: relative;
    .button {
      background: var(--background-tertiary);
      border: none;
      color: var(--content-text);
      font-size: 23px;
      display: flex;
      border-radius: 0px 8px 8px 0px;
      .icon {
      }
    }
    .list {
      display: none;
      &.show {
        display: flex;
        flex-direction: column;
        position: absolute;
        background: var(--background-primary);
        color: var(--content-text);
        .item {
          background: none;
          border: none;
          color: inherit;
          padding: 6px 12px;
        }
      }
    }
  }
}
</style>
