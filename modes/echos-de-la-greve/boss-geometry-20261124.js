/* Native boss and effect crops. Earlier six boss bounds use alpha>16; the remaining eight and effects use alpha>8.
 * All crops preserve three pixels of transparent margin. Bosses face left in their source PNG.
 * Per-pose height ratios preserve the apparent body scale; they are initial art direction, not canonical measurements.
 */
window.StrandBossGeometry = {
  "bosses": {
    "lion": {
      "idle": {
        "crop": [
          62,
          28,
          1695,
          828
        ],
        "anchorX": 0.5,
        "baselineY": 0.996377,
        "heightRatio": 1,
        "nativeFacing": -1
      },
      "attack": {
        "crop": [
          40,
          60,
          1726,
          782
        ],
        "anchorX": 0.5,
        "baselineY": 0.996164,
        "heightRatio": 0.94,
        "nativeFacing": -1
      },
      "stagger": {
        "crop": [
          196,
          5,
          1469,
          853
        ],
        "anchorX": 0.5,
        "baselineY": 0.996483,
        "heightRatio": 1.03,
        "nativeFacing": -1
      }
    },
    "squid": {
      "idle": {
        "crop": [
          15,
          18,
          1745,
          848
        ],
        "anchorX": 0.5,
        "baselineY": 0.996462,
        "heightRatio": 1,
        "nativeFacing": -1
      },
      "attack": {
        "crop": [
          10,
          20,
          1841,
          816
        ],
        "anchorX": 0.5,
        "baselineY": 0.996324,
        "heightRatio": 0.96,
        "nativeFacing": -1
      },
      "stagger": {
        "crop": [
          68,
          13,
          1656,
          862
        ],
        "anchorX": 0.5,
        "baselineY": 0.99652,
        "heightRatio": 1.02,
        "nativeFacing": -1
      }
    },
    "whale": {
      "idle": {
        "crop": [
          20,
          18,
          1958,
          757
        ],
        "anchorX": 0.5,
        "baselineY": 0.996037,
        "heightRatio": 1,
        "nativeFacing": -1
      },
      "attack": {
        "crop": [
          53,
          11,
          1899,
          774
        ],
        "anchorX": 0.5,
        "baselineY": 0.996124,
        "heightRatio": 1.02,
        "nativeFacing": -1
      },
      "stagger": {
        "crop": [
          76,
          10,
          1834,
          772
        ],
        "anchorX": 0.5,
        "baselineY": 0.996114,
        "heightRatio": 1.02,
        "nativeFacing": -1
      }
    },
    "giant": {
      "idle": {
        "crop": [
          89,
          17,
          644,
          1746
        ],
        "anchorX": 0.5,
        "baselineY": 0.998282,
        "heightRatio": 1,
        "nativeFacing": -1
      },
      "attack": {
        "crop": [
          19,
          99,
          1139,
          1152
        ],
        "anchorX": 0.5,
        "baselineY": 0.997396,
        "heightRatio": 0.7,
        "nativeFacing": -1
      },
      "stagger": {
        "crop": [
          66,
          54,
          892,
          1435
        ],
        "anchorX": 0.5,
        "baselineY": 0.997909,
        "heightRatio": 0.95,
        "nativeFacing": -1
      }
    },
    "mule-truck": {
      "idle": {
        "crop": [
          74,
          30,
          1629,
          825
        ],
        "anchorX": 0.5,
        "baselineY": 0.996364,
        "heightRatio": 1,
        "nativeFacing": -1
      },
      "damaged": {
        "crop": [
          76,
          32,
          1627,
          821
        ],
        "anchorX": 0.5,
        "baselineY": 0.996346,
        "heightRatio": 1,
        "nativeFacing": -1
      }
    }
  },
  "effects": {
    "tar-orb": {
      "crop": [
        170,
        123,
        1436,
        639
      ],
      "anchorX": 0.5,
      "anchorY": 0.5,
      "nativeFacing": 1
    },
    "tar-spike": {
      "crop": [
        56,
        75,
        911,
        1392
      ],
      "anchorX": 0.5,
      "anchorY": 0.997845,
      "nativeFacing": 1
    },
    "chiral-ring": {
      "crop": [
        77,
        75,
        1382,
        873
      ],
      "anchorX": 0.5,
      "anchorY": 0.5,
      "nativeFacing": 1
    },
    "mule-bolt": {
      "crop": [
        231,
        226,
        1767,
        246
      ],
      "anchorX": 0.5,
      "anchorY": 0.5,
      "nativeFacing": 1
    }
  }
};
