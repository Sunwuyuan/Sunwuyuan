<script setup lang="ts">
import { marked } from "marked";
import { ref, onMounted } from "vue";
import readmeRaw from "../../../README.md?raw";

const renderedHtml = ref("");

onMounted(() => {
  renderedHtml.value = marked.parse(readmeRaw) as string;
});
</script>

<template>
  <section class="section-reveal">

    <div
      class="readme-content text-sm leading-relaxed text-muted-foreground"
      v-html="renderedHtml"
    />
  </section>
</template>

<style scoped>
.readme-content :deep(h1) {
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: hsl(var(--foreground));
}
.readme-content :deep(h2) {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: hsl(var(--foreground));
}
.readme-content :deep(h3),
.readme-content :deep(h4) {
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 0.75em;
  margin-bottom: 0.4em;
  color: hsl(var(--foreground));
}
.readme-content :deep(p) {
  margin-bottom: 0.75em;
  line-height: 1.8;
}
.readme-content :deep(ul),
.readme-content :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}
.readme-content :deep(ul) {
  list-style-type: disc;
}
.readme-content :deep(ol) {
  list-style-type: decimal;
}
.readme-content :deep(li) {
  margin-bottom: 0.25em;
  line-height: 1.7;
}
.readme-content :deep(a) {
  color: hsl(var(--primary));
  text-decoration: none;
  border-bottom: 1px solid hsla(var(--primary) / 0.3);
  transition: border-color 0.2s;
}
.readme-content :deep(a:hover) {
  border-bottom-color: hsl(var(--primary));
}
.readme-content :deep(code) {
  background: hsl(var(--muted));
  padding: 0.15em 0.4em;
  border-radius: 0.25em;
  font-size: 0.88em;
  font-family: "SF Mono", "Fira Code", monospace;
}
.readme-content :deep(pre) {
  background: hsl(var(--muted));
  padding: 0.75em 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin-bottom: 0.75em;
}
.readme-content :deep(pre code) {
  background: none;
  padding: 0;
}
.readme-content :deep(blockquote) {
  border-left: 3px solid hsl(var(--primary));
  padding-left: 1em;
  margin-left: 0;
  margin-bottom: 0.75em;
  color: hsl(var(--muted-foreground));
}
.readme-content :deep(hr) {
  border: none;
  border-top: 1px solid hsl(var(--border));
  margin: 1.25em 0;
}
.readme-content :deep(img) {
  max-width: 100%;
  border-radius: 0.5em;
  margin: 0.5em 0;
}
.readme-content :deep(> *:first-child) {
  margin-top: 0;
}
.readme-content :deep(> *:last-child) {
  margin-bottom: 0;
}
</style>
