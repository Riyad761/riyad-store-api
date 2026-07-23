function compareVersions(oldVersion = "1.0.0", newVersion = "1.0.0") {
  const oldParts = oldVersion.split(".").map(Number);
  const newParts = newVersion.split(".").map(Number);

  const length = Math.max(oldParts.length, newParts.length);

  for (let i = 0; i < length; i++) {
    const oldNum = oldParts[i] || 0;
    const newNum = newParts[i] || 0;

    if (newNum > oldNum) return 1;
    if (newNum < oldNum) return -1;
  }

  return 0;
}

module.exports = compareVersions;
