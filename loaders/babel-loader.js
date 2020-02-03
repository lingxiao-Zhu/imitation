module.exports = function(content) {
  return someSyncOperation(content, this.data.value);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  if (someCondition()) {
    // fast exit

    return 'module.exports = require(' + JSON.stringify('-!' + remainingRequest) + ');';
  }

  data.value = 42;
};
