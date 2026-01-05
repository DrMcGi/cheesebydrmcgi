#!/usr/bin/env node

/**
 * Generate deterministic audio files for the project
 * Pure JavaScript WAV generation with no native dependencies
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SAMPLE_RATE = 44100; // Hz
const BIT_DEPTH = 16;
const CHANNELS = 1; // Mono
const SEED = 42; // Change this to get different audio

/**
 * Simple seeded pseudo-random number generator (LCG)
 * Returns values between 0 and 1
 */
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
}

/**
 * Write WAV file in pure JavaScript
 * @param {string} filename - Output filename
 * @param {Float32Array} samples - Audio samples (-1.0 to 1.0)
 * @param {number} sampleRate - Sample rate in Hz
 */
function writeWavFile(filename, samples, sampleRate) {
  const numSamples = samples.length;
  const bytesPerSample = BIT_DEPTH / 8;
  const dataSize = numSamples * bytesPerSample;
  const fileSize = 44 + dataSize; // 44 bytes for WAV header

  const buffer = Buffer.alloc(fileSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4); // File size - 8
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // Audio format (1 = PCM)
  buffer.writeUInt16LE(CHANNELS, 22); // Number of channels
  buffer.writeUInt32LE(sampleRate, 24); // Sample rate
  buffer.writeUInt32LE(sampleRate * CHANNELS * bytesPerSample, 28); // Byte rate
  buffer.writeUInt16LE(CHANNELS * bytesPerSample, 32); // Block align
  buffer.writeUInt16LE(BIT_DEPTH, 34); // Bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples as 16-bit PCM
  for (let i = 0; i < numSamples; i++) {
    // Clamp to -1.0 to 1.0 and convert to 16-bit integer
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const int16 = Math.round(sample * 32767);
    buffer.writeInt16LE(int16, 44 + i * bytesPerSample);
  }

  // Ensure directory exists
  try {
    mkdirSync(dirname(filename), { recursive: true });
  } catch (err) {
    // Ignore EEXIST errors, rethrow others
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  writeFileSync(filename, buffer);
  console.log(`✓ Generated ${filename} (${(fileSize / 1024).toFixed(2)} KB)`);
}

/**
 * Generate low-bass-drone.wav
 * Sine/triangle base around 55Hz with subtle harmonics, slow LFO amplitude modulation, very light noise floor
 * Loopable and non-clicking
 */
function generateLowBassDrone() {
  const duration = 4; // seconds (loopable segment)
  const numSamples = SAMPLE_RATE * duration;
  const samples = new Float32Array(numSamples);
  
  const random = new SeededRandom(SEED);
  
  // Fundamental frequency (A1)
  const fundamental = 55;
  
  // LFO for amplitude modulation
  const lfoFreq = 0.25; // Hz (slow modulation)
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const phase = 2 * Math.PI * fundamental * t;
    
    // Base oscillator: mix of sine (70%) and triangle (30%)
    const sine = Math.sin(phase);
    const triangle = (2 / Math.PI) * Math.asin(Math.sin(phase));
    const base = 0.7 * sine + 0.3 * triangle;
    
    // Add subtle harmonics
    const harmonic2 = 0.15 * Math.sin(2 * phase); // 2nd harmonic
    const harmonic3 = 0.08 * Math.sin(3 * phase); // 3rd harmonic
    
    // LFO amplitude modulation (0.85 to 1.0 range)
    const lfo = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(2 * Math.PI * lfoFreq * t));
    
    // Very light noise floor
    const noise = (random.next() - 0.5) * 0.02;
    
    // Combine all components
    let sample = (base + harmonic2 + harmonic3) * lfo + noise;
    
    // Apply fade in/out to ensure loop-ability (first and last 0.1s)
    const fadeTime = 0.1;
    if (t < fadeTime) {
      sample *= t / fadeTime;
    } else if (t > duration - fadeTime) {
      sample *= (duration - t) / fadeTime;
    }
    
    // Normalize to prevent clipping
    samples[i] = sample * 0.3; // Keep volume relatively low
  }
  
  return samples;
}

/**
 * Generate cash-counter.wav
 * Sparse mechanical click ticks with slight jitter timing, subtle high-frequency transient, optional faint tape/room noise
 * Loopable and non-clicking
 */
function generateCashCounter() {
  const duration = 2; // seconds (loopable segment)
  const numSamples = SAMPLE_RATE * duration;
  const samples = new Float32Array(numSamples);
  
  const random = new SeededRandom(SEED + 1);
  
  // Add faint tape/room noise throughout
  for (let i = 0; i < numSamples; i++) {
    samples[i] = (random.next() - 0.5) * 0.015;
  }
  
  // Generate sparse clicks
  const clickInterval = 0.25; // Base interval between clicks (seconds)
  let nextClickTime = clickInterval;
  
  while (nextClickTime < duration - 0.1) { // Avoid clicks too close to end
    // Add jitter (±20%)
    const jitter = (random.next() - 0.5) * 0.4 * clickInterval;
    const clickTime = nextClickTime + jitter;
    
    if (clickTime > 0.05 && clickTime < duration - 0.05) {
      const clickSample = Math.floor(clickTime * SAMPLE_RATE);
      
      // Generate mechanical click with high-frequency transient
      const clickDuration = 0.01; // 10ms click
      const clickSamples = Math.floor(clickDuration * SAMPLE_RATE);
      
      for (let i = 0; i < clickSamples && clickSample + i < numSamples; i++) {
        const t = i / SAMPLE_RATE;
        const envelope = Math.exp(-t / 0.002); // Fast decay
        
        // High-frequency transient (800Hz - 2000Hz)
        const freq = 800 + 1200 * Math.exp(-t / 0.001);
        const transient = Math.sin(2 * Math.PI * freq * t) * envelope;
        
        // Add some noise for mechanical quality
        const clickNoise = (random.next() - 0.5) * 0.3 * envelope;
        
        samples[clickSample + i] += (transient + clickNoise) * 0.5;
      }
    }
    
    nextClickTime += clickInterval;
  }
  
  // Normalize
  let maxAmp = 0;
  for (let i = 0; i < numSamples; i++) {
    maxAmp = Math.max(maxAmp, Math.abs(samples[i]));
  }
  if (maxAmp > 0) {
    for (let i = 0; i < numSamples; i++) {
      samples[i] = samples[i] / maxAmp * 0.6; // Normalize to 60% max
    }
  }
  
  return samples;
}

// Main execution
function main() {
  const outputDir = `${__dirname}/../public/audio`;
  const bassDroneFile = `${outputDir}/low-bass-drone.wav`;
  const cashCounterFile = `${outputDir}/cash-counter.wav`;
  
  // Check if files already exist (skip generation during postinstall if already present)
  const filesExist = existsSync(bassDroneFile) && existsSync(cashCounterFile);
  
  // Allow forcing regeneration via environment variable
  const forceRegenerate = process.env.FORCE_REGENERATE === 'true' || process.argv.includes('--force');
  
  if (filesExist && !forceRegenerate) {
    console.log('✓ Audio files already exist. Skipping generation.');
    console.log('  Run with --force flag or FORCE_REGENERATE=true to regenerate.');
    return;
  }
  
  console.log('Generating audio files...');
  console.log(`Seed: ${SEED} (change to regenerate with different audio)`);
  
  // Generate low-bass-drone
  const bassDrone = generateLowBassDrone();
  writeWavFile(bassDroneFile, bassDrone, SAMPLE_RATE);
  
  // Generate cash-counter
  const cashCounter = generateCashCounter();
  writeWavFile(cashCounterFile, cashCounter, SAMPLE_RATE);
  
  console.log('\n✓ All audio files generated successfully!');
}

main();
