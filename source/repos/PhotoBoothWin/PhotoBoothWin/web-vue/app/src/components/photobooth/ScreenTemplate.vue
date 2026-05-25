<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Template } from '@/types/photobooth'
import { usePhotobooth } from '@/composables/usePhotobooth'
import { unlockCountdownAudio } from '@/composables/useTakePicture'

const { templates, selectedTemplate, selectTemplate, showScreen } = usePhotobooth()

const msgboxVisible = ref(false)
const hasSelection = computed(() => !!selectedTemplate.value)

/** 與設計稿一致：左至右 bk01、bk02、bk03 */
const orderedTemplates = computed(() => {
  const order = ['bk01', 'bk02', 'bk03']
  const byId = new Map(templates.value.map((t) => [t.id, t] as const))
  const ordered = order.map((id) => byId.get(id)).filter((t): t is Template => !!t)
  const rest = templates.value.filter((t) => !order.includes(t.id))
  return [...ordered, ...rest]
})

function getTemplateCardClass(t: Template) {
  return `screen-template__card--${t.id}`
}

function onCardClick(t: Template) {
  if (selectedTemplate.value?.id === t.id) {
    msgboxVisible.value = true
    return
  }
  selectTemplate(t)
}

function confirmTemplate() {
  unlockCountdownAudio()
  msgboxVisible.value = false
  showScreen('shoot')
}

function repeatChoose() {
  msgboxVisible.value = false
}

watch(selectedTemplate, (v) => {
  if (!v) msgboxVisible.value = false
})
</script>

<template>
  <div class="screen screen--template" role="region" aria-label="選版型畫面">
    <!-- 標題、外框、版型名稱皆繪於 background.png，此處只放三張可點選的預覽圖 -->
    <div class="screen-template__main">
      <div
        class="screen-template__grid"
        :class="{ 'has-selection': hasSelection }"
      >
        <button
          v-for="t in orderedTemplates"
          :key="t.id"
          type="button"
          class="screen-template__card"
          :class="[getTemplateCardClass(t), { 'is-selected': selectedTemplate?.id === t.id }]"
          :aria-label="t.chooseLabel"
          @click="onCardClick(t)"
        >
          <div class="screen-template__card-preview">
            <img
              class="screen-template__card-img"
              :src="t.preview"
              :alt="t.chooseLabel"
              loading="lazy"
            />
          </div>
        </button>
      </div>
    </div>

    <div
      class="screen-template__msgbox"
      :class="{ 'screen-template__msgbox--hidden': !msgboxVisible }"
      role="dialog"
      aria-modal="true"
      aria-label="確認版型"
    >
      <div class="screen-template__msgbox-backdrop" @click="msgboxVisible = false" />
      <div class="screen-template__msgbox-window">
        <img
          class="screen-template__msgbox-window-bg"
          src="/assets/templates/chooselayout/msgbox/window.png"
          alt=""
        />
        <div class="screen-template__msgbox-btns">
          <button
            type="button"
            class="screen-template__msgbox-btn screen-template__msgbox-btn--confirm"
            aria-label="確認"
            @click="confirmTemplate"
          >
            <img src="/assets/templates/chooselayout/msgbox/confirm.png" alt="確認" />
          </button>
          <button
            type="button"
            class="screen-template__msgbox-btn screen-template__msgbox-btn--repeat"
            aria-label="重選"
            @click="repeatChoose"
          >
            <img src="/assets/templates/chooselayout/msgbox/repeat.png" alt="重選" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

:global(.photobooth-app:has(.screen--template.active) .app-footer) {
  display: none;
}

.screen--template {
  position: relative;
  display: block;
  min-height: 100vh;
  padding: 0;
  overflow: hidden;
  background-color: #4a1520;
  background-image: url('#{$path-templates}/chooselayout/background.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

/* 對齊背景圖內側白框區域：三張預覽橫向排列 */
.screen-template__main {
  position: absolute;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  width: min(178vw, 1780px);
  padding: 0;
  box-sizing: border-box;
  z-index: 1;
}

.screen-template__grid {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding-inline: clamp(20px, 3vw, 40px);
  box-sizing: border-box;

  &.has-selection .screen-template__card:not(.is-selected) {
    opacity: 0.75;
  }
}

.screen-template__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  max-width: 520px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: transform 0.25s ease, opacity 0.25s ease;

  &.is-selected {
    transform: scale(1.04);
    z-index: 2;

    .screen-template__card-preview {
      outline: 3px solid var(--accent, #ff4d4f);
      outline-offset: 3px;
      border-radius: $radius-md;
    }
  }
}

.screen-template__card-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  line-height: 0;
  transition: outline 0.2s ease;
}

.screen-template__card--bk01 .screen-template__card-preview,
.screen-template__card--bk03 .screen-template__card-preview {
  max-width: clamp(220px, 24vw, 360px);
}

.screen-template__card--bk02 .screen-template__card-preview {
  max-width: clamp(320px, 34vw, 520px);
}

.screen-template__card-img {
  width: 100%;
  height: auto;
  max-height: min(62vh, 680px);
  display: block;
  object-fit: contain;
}

.screen-template__msgbox {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &.screen-template__msgbox--hidden {
    display: none !important;
  }
}

.screen-template__msgbox-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.screen-template__msgbox-window {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.screen-template__msgbox-window-bg {
  display: block;
  max-width: 100%;
  height: auto;
}

.screen-template__msgbox-btns {
  display: flex;
  gap: $spacing-5xl;
  justify-content: center;
  align-items: center;
  margin-top: -150px;
}

.screen-template__msgbox-btn {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: block;
  transition: opacity 0.2s;

  img {
    display: block;
    width: auto;
    height: auto;
    max-height: 80px;
  }

  &:hover {
    opacity: 0.9;
  }
}
</style>
