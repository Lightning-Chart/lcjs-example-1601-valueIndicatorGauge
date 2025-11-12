const lcjs = require('@lightningchart/lcjs')
const { lightningChart, Themes, ColorRGBA } = lcjs

// Create a Gauge chart
const gauge = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .Gauge({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Temperature')
    .setUnitLabel('°C')
    .setInterval(-20, 20)
    .setGapBetweenBarAndValueIndicators(2)

// Construct value indicator array from a color palette
const valueIndicators = []
const colorPalette = [ColorRGBA(54, 75, 255), ColorRGBA(0, 180, 255), ColorRGBA(255, 220, 0), ColorRGBA(255, 50, 10)]
const intervalStart = -20
const intervalEnd = 20
const stepSize = (intervalEnd - intervalStart) / colorPalette.length
colorPalette.forEach((color, index) => {
    valueIndicators.push({
        start: Math.round(intervalStart + stepSize * index),
        end: Math.round(intervalStart + stepSize * (index + 1)),
        color,
    })
})
gauge.setValueIndicators(valueIndicators)

// Scale the gauge automatically based on screen size
gauge.addEventListener('resize', (event) => {
    const size = Math.min(event.width, event.height)
    gauge
        .setBarThickness(size / 10)
        .setNeedleLength(gauge.getBarThickness() * 2)
        .setValueIndicatorThickness(gauge.getBarThickness() / 3)
        .setNeedleThickness(gauge.getBarThickness() / 10)
    const fontSizeBig = Math.round(size / 10)
    const fontSizeSmaller = Math.round(size / 20)
    gauge.setUnitLabelFont((font) => font.setSize(fontSizeSmaller))
    gauge.setTickFont((font) => font.setSize(fontSizeSmaller))
    gauge.setValueLabelFont((font) => font.setSize(fontSizeBig))
})

// Randomize gauge value every 2 seconds
setInterval(() => {
    gauge.setValue(Math.random() * 40 - 20)
}, 2000)
