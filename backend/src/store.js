const scans = [];

function addScan(scan) {
  scans.push({
    uid: scan.uid,
    device: scan.device,
    time: new Date().toISOString()
  });
}

function getScans() {
  return scans;
}

module.exports = { addScan, getScans };