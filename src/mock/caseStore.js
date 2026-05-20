const STORAGE_KEY = 'mock_cases';

function readAll() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
}

function writeAll(cases) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function listCases() {
  return readAll();
}

export function updateFollowupStatus(caseId, label, status) {
  const cases = readAll();
  const next = cases.map((item) => {
    if (item.caseId !== caseId) return item;
    const followups = (item.workflowResult?.followups || []).map((f) => (
      f.label === label ? { ...f, status } : f
    ));
    return {
      ...item,
      workflowResult: {
        ...item.workflowResult,
        followups,
      },
    };
  });
  writeAll(next);
  return next;
}
