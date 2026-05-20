import triageRules from './data/triageRules.json';
import hospitalPaths from './data/hospitalPaths.json';
import insuranceDocs from './data/insuranceDocs.json';
import followupTemplates from './data/followupTemplates.json';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function identifyProblems(inputText) {
  const tags = [];
  Object.entries(triageRules.problemTags).forEach(([keyword, tag]) => {
    if (inputText.includes(keyword) && !tags.includes(tag)) tags.push(tag);
  });
  return tags.length > 0 ? tags : ['体检报告异常'];
}

function triageByText(inputText) {
  if (triageRules.urgentKeywords.some((keyword) => inputText.includes(keyword))) {
    return { level: '紧急处理', reason: '文本中出现高风险关键词，建议优先就医评估。' };
  }
  if (triageRules.soonKeywords.some((keyword) => inputText.includes(keyword))) {
    return { level: '建议尽快跟进', reason: '存在异常或复查相关线索，建议尽快推进专科判断。' };
  }
  return { level: '常规关怀', reason: '当前描述未见明确高风险信号，可按常规节奏推进。' };
}

function summarize(inputText, client) {
  return `客户：${client.name}；涉及：${client.subject}；地区：${client.region}。核心描述：${inputText || client.note || '暂无补充描述'}。`;
}

export async function analyzeCase({ client, inputText, scriptText }) {
  await delay(400);
  const problems = identifyProblems(inputText || client.note || '');
  const triage = triageByText(inputText || client.note || '');
  return {
    summary: summarize(inputText, client),
    problems,
    triage,
    paths: hospitalPaths.default,
    insurance: insuranceDocs.default,
    script: scriptText,
    followups: followupTemplates.default,
  };
}

export async function saveCase(payload) {
  await delay(200);
  const savedAt = new Date().toISOString();
  const caseId = `CASE-${Date.now().toString().slice(-6)}`;
  const normalizedFollowups = (payload.workflowResult?.followups || []).map((item) => ({ ...item, status: item.status || 'pending' }));
  const saved = {
    ...payload,
    workflowResult: {
      ...payload.workflowResult,
      followups: normalizedFollowups,
    },
    caseId,
    savedAt,
  };
  const current = JSON.parse(window.localStorage.getItem('mock_cases') || '[]');
  current.unshift(saved);
  window.localStorage.setItem('mock_cases', JSON.stringify(current));
  return { caseId, savedAt };
}

export function listSavedCases() {
  return JSON.parse(window.localStorage.getItem('mock_cases') || '[]');
}
