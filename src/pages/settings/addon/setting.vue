<template>
  <div :class="$style.setting">
    <div>{{ setting.name }}</div>
    <div :class="$style.options">
      <input
        v-if="setting.type === 'integer'"
        :class="$style.input"
        name="addon-setting"
        type="number"
        :min="setting.min"
        v-model="inputValue"
      />
      <Toggle
        v-if="setting.type === 'boolean'"
        :state="inputValue"
        @click="inputValue = !inputValue"
      />
      <div
        :class="$style.preset"
        v-if="hasExtraPresets"
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
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import chevronDown from "@iconify-icons/tabler/chevron-down";
import { ExtraAddonManifest } from "../../../../esbuild/addon-helpers";
import { ref, watch } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import Toggle from "../components/toggle.vue";

const { setting, presetNames, value } = defineProps<{
  setting: ExtraAddonManifest["settings"][number];
  presetNames: ExtraAddonManifest["presetNames"];
  value: string | number | boolean;
}>();

const keys = Object.keys(setting.presets);
const hasExtraPresets = keys.length > 1 || !keys.includes("default");

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
  align-items: center;
  gap: 10px;

  .options {
    display: flex;
    overflow: hidden;
    height: 32px;

    .input {
      width: 80px;
      background: var(--background-primary);
      color: var(--content-text);
      padding: 0 6px 0 12px;
      outline: none;
      border-radius: 12px 0px 0px 12px;
      border: 1px solid var(--border);
      border-right: none;

      &:focus-visible {
        box-shadow: inset 0 0 0 3px #fff;
      }
    }
    .preset {
      height: 100%;
      .button {
        height: 100%;
        background: var(--background-primary);
        color: var(--content-text);
        font-size: 23px;
        display: flex;
        align-items: center;
        outline: none;
        border-radius: 0px 12px 12px 0px;
        border: 1px solid var(--border);
        border-left: none;

        &:focus-visible {
          box-shadow: inset 0 0 0 3px #fff;
        }
        .icon {
          font-size: 16px;
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
          padding: 6px 0;
          border-radius: 4px;
          color: var(--content-text);
          border: 1px solid var(--border);
          .item {
            background: none;
            border: none;
            color: inherit;
            padding: 6px 12px;
            user-select: none;
            transition: 0.2s ease;
            border-radius: 2px;

            &:focus-visible {
              box-shadow: inset 0 0 0 3px #fff;
            }

            &:hover {
              background: var(--background-hover);
            }
            .value {
              margin-left: 12px;
              color: var(--disabled);
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>
