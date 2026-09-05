package com.retinascan.ai.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val PrimaryBlue = Color(0xFF0061A4)
val OnPrimary = Color(0xFFFFFFFF)
val PrimaryContainer = Color(0xFFD1E4FF)
val OnPrimaryContainer = Color(0xFF001D36)

val SurfaceLight = Color(0xFFFDFCFF)
val SurfaceContainerLowest = Color(0xFFFFFFFF)
val SurfaceContainerLow = Color(0xFFF7F8FC)
val SurfaceContainer = Color(0xFFEFF1F6)
val OutlineVariant = Color(0xFFC3C7CF)
val TextDark = Color(0xFF1A1C1E)
val TextMuted = Color(0xFF43474E)
val ErrorRed = Color(0xFFBA1A1A)
val SuccessGreen = Color(0xFF1B6C30)

private val LightColors = lightColorScheme(
    primary = PrimaryBlue,
    onPrimary = OnPrimary,
    primaryContainer = PrimaryContainer,
    onPrimaryContainer = OnPrimaryContainer,
    surface = SurfaceLight,
    onSurface = TextDark,
    surfaceVariant = SurfaceContainerLow,
    onSurfaceVariant = TextMuted,
    outline = OutlineVariant,
    error = ErrorRed
)

@Composable
fun RetinaScanTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColors,
        content = content
    )
}
