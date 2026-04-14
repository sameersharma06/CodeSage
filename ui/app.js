async function startReview() {
  const url = document.getElementById('repo-url').value.trim()
  if (!url) return

  const btn = document.getElementById('review-btn')
  const status = document.getElementById('status')
  const results = document.getElementById('results')

  btn.disabled = true
  results.classList.add('hidden')
  status.className = 'status'
  status.innerHTML = '<div class="spinner"></div> Cloning and analyzing repository — this takes 2–3 minutes...'

  try {
    const res = await fetch('/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ github_url: url })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Review failed')
    }

    const data = await res.json()
    status.classList.add('hidden')
    renderResults(data)
    loadMemoryStats()

  } catch (e) {
    status.className = 'status error'
    status.innerHTML = '❌ ' + e.message
  } finally {
    btn.disabled = false
  }
}

function renderResults(data) {
  const results = document.getElementById('results')
  results.classList.remove('hidden')

  // Health banner
  const banner = document.getElementById('health-banner')
  const healthClass = data.health === 'GOOD' ? 'good'
    : data.health === 'NEEDS WORK' ? 'needs-work' : 'critical'
  banner.className = 'health-banner ' + healthClass
  document.getElementById('health-label').textContent = data.health
  document.getElementById('health-url').textContent = data.url

  const c = data.issue_counts
  document.getElementById('health-counts').innerHTML = `
    <div class="count-item">
      <div class="count-num">${data.file_count}</div>
      <div class="count-lbl">Files</div>
    </div>
    <div class="count-item">
      <div class="count-num">${c.total}</div>
      <div class="count-lbl">Issues</div>
    </div>
  `

  // Count boxes
  document.getElementById('counts-row').innerHTML = `
    <div class="count-box c"><div class="n">${c.critical || 0}</div><div class="l">Critical</div></div>
    <div class="count-box h"><div class="n">${c.high || 0}</div><div class="l">High</div></div>
    <div class="count-box m"><div class="n">${c.medium || 0}</div><div class="l">Medium</div></div>
    <div class="count-box lo"><div class="n">${c.low || 0}</div><div class="l">Low</div></div>
  `

  // Issues
  const list = document.getElementById('issues-list')
  if (!data.issues || data.issues.length === 0) {
    list.innerHTML = '<div class="memory-box">No issues found. Code looks clean.</div>'
    return
  }

  list.innerHTML = data.issues.map((issue, i) => {
    const sev = issue.severity || 'LOW'
    const filename = issue.filename || ''
    const source = issue.source || 'MODEL'
    const message = issue.message || issue.fast_review || ''
    const deepReview = issue.deep_review || ''
    const codeLine = issue.code || ''

    return `
    <div class="issue-card">
      <div class="issue-header" onclick="toggleIssue(${i})">
        <span class="severity-badge sev-${sev}">${sev}</span>
        <span class="issue-filename">${filename}</span>
        <span class="issue-source">${source}</span>
        <span class="chevron" id="chev-${i}">▼</span>
      </div>
      <div class="issue-body" id="body-${i}">
        ${message ? `
        <div class="issue-field">
          <div class="field-label">Issue</div>
          <div class="field-value">${message}</div>
        </div>` : ''}
        ${codeLine ? `
        <div class="issue-field">
          <div class="field-label">Code</div>
          <div class="code-line">${escHtml(codeLine)}</div>
        </div>` : ''}
        ${deepReview ? `
        <div class="issue-field">
          <div class="field-label">Deep Analysis</div>
          <div class="field-value">${deepReview}</div>
        </div>` : ''}
      </div>
    </div>`
  }).join('')
}

function toggleIssue(i) {
  const body = document.getElementById('body-' + i)
  const chev = document.getElementById('chev-' + i)
  const open = body.classList.toggle('open')
  chev.style.transform = open ? 'rotate(180deg)' : ''
}

async function loadMemoryStats() {
  try {
    const res = await fetch('/stats')
    const data = await res.json()
    const box = document.getElementById('memory-stats')
    const patterns = data.top_patterns.map(([k, v]) =>
      `<strong>${k}</strong>: ${v} occurrences`
    ).join(' &nbsp;·&nbsp; ')
    box.innerHTML = `
      <strong>${data.total_reviews}</strong> repos reviewed &nbsp;·&nbsp;
      <strong>${data.total_issues}</strong> total issues found &nbsp;·&nbsp;
      Top patterns: ${patterns || 'none yet'}
    `
  } catch (e) {
    // silent fail
  }
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

document.getElementById('repo-url').addEventListener('keydown', e => {
  if (e.key === 'Enter') startReview()
})