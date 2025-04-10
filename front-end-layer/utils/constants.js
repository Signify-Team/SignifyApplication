/**
 * @file constants.js
 * @description Includes constants for the application for consistency.
 *
 * @datecreated 05.11.2024
 * @lastmodified 20.12.2024
 */

export const COLORS = {
    primary: '#8EB1CF',
    secondary: '#F76C63',
    tertiary: '#87CB97',
    neutral_base_dark: '#333333',
    neutral_base_soft: '#D1E2EC',
    button_color: '#EB4511',
    highlight_color_2: '#EE3C3C',
    dark_accent: '#2C2C2C',
    soft_accent: '#F9E2D0',
    dark_gray_1: '#969797',
    lemonade: '#FFFFC7',
    bright_button_color: '#4068F5',
    light_gray_1: '#DDDDDD',
    light_gray_2: '#EEEEEE',
    soft_pink_background: '#FFE5E5',
    gray: '#D9D9D9',
    paw_color: '#8EB1CF',
    soft_container_color: '#B3D0E8',
    button_underline: 'rgba(218, 218, 244, 0.3)',
    white: '#FFFFFF',
    start_button: '#FFCC00',
    premium_gold: '#D4AF37',
};

export const FONTS = {
    baloo_font: 'Baloo2-Bold',
    poppins_font: 'Poppins-Regular',
    login_box_credential_font: 'PassionOne-Regular',
    description_font: 'Inter_28pt-Regular',
    game_button_font: 'Nunito-Black',
    title: 24,
    body: 16,
};

export const SIZES = {
    statsContainer: 0.09,
    badgesContainer: 0.085,
};

// Converts hex to rgba for opacity handling in styles
export const hexToRgba = (hex, opacity) => {
    let r = 0, g = 0, b = 0;

    // Handle shorthand hex (#RGB)
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // Handle full hex (#RRGGBB)
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Darkens a color by a specified amount
export const darkenColor = (color, amount) => {
    let colorValue = color.startsWith('#') ? color.slice(1) : color;

    // Parse the hex color to get RGB components
    const r = Math.max(0, parseInt(colorValue.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(colorValue.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(colorValue.substring(4, 6), 16) - amount);

    // Convert each component back to a hex value
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
};

export const API = {
    UPLOAD_TIMEOUT: 10000,
    PROCESS_TIMEOUT: 30000,
    BASE_URL: 'http://192.168.1.111:8000',
};

export const VIDEO = {
    FRAME_INTERVAL: 6,
    TARGET_WIDTH: 320,
    TARGET_HEIGHT: 240,
    MAX_FRAMES: 15,
    HAND_DETECTION_THRESHOLD: 0.08,
    GPT_MAX_TOKENS: 5,
    GPT_TEMPERATURE: 0.1,
};

export const GESTURE_UI = {
    QUESTION_WIDTH: 0.8,
    QUESTION_MARGIN_BOTTOM: 0.01,
    QUESTION_FONT_SIZE: 20,
    GEST_CONTAINER_WIDTH: 0.82,
    GEST_CONTAINER_HEIGHT: 0.58,
    GEST_CONTAINER_BORDER_RADIUS: 16,
    CAMERA_WIDTH: 0.75,
    CAMERA_HEIGHT: 0.55,
    BUTTON_WIDTH: 0.35,
    SUBMIT_BUTTON_WIDTH: 0.4,
    BUTTON_GAP: 0.05,
    BUTTON_MARGIN_VERTICAL: 0.02,
    MODAL_WIDTH: 0.8,
    MODAL_PADDING: 20,
    MODAL_BORDER_RADIUS: 12,
    MODAL_FONT_SIZE: 18,
    MODAL_TEXT_MARGIN_BOTTOM: 20,
    PERMISSION_TEXT_MARGIN_TOP: 0.4,
    PERMISSION_FONT_SIZE: 18,
};
