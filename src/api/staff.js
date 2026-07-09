/**
 * Staff Mock API — mirrors admin API surface with mock data.
 * Replace with real API calls when backend is ready.
 */

const DELAY_MS = 150
function d(ms = DELAY_MS) { return new Promise((r) => setTimeout(r, ms)) }
function pg(list, pi = 1, ps = 10) {
  const s = (pi - 1) * ps
  return { data: list.slice(s, s + ps), totalCount: list.length, pageIndex: pi, pageSize: ps }
}

const FN = ['Alex','Maria','David','Sarah','James','Emily','Michael','Jessica','Daniel','Laura']
const LN = ['Johnson','Chen','Kim','Wilson','Brown','Davis','Miller','Garcia','Martinez','Taylor']

const mEv = Array.from({length:45},(_,i)=>({
  id:`ev-${i+1}`,name:`Hackathon ${2020+Math.floor(i/4)} - ${['Spring','Summer','Fall','Winter'][i%4]}`,
  startTime:new Date(2025,i%12,(i+1)*3).toISOString(),endTime:new Date(2025,(i%12)+1,(i+1)*3+7).toISOString(),
  status:i<25?'Published':i<38?'Draft':'Closed',isDisable:i%10===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
  description:`Desc for event ${i+1}.`,
}))

const mUs = Array.from({length:80},(_,i)=>({
  id:`us-${i+1}`,email:`user${i+1}@seal.dev`,
  firstName:FN[i%10],lastName:LN[i%10],fullName:`${FN[i%10]} ${LN[i%10]}`,
  role:['Admin','Staff','Student','Lecturer'][i%4],isDisable:i%12===0,isVerified:i%20!==0,
  isBanned:i%15===0,banReason:i%15===0?'Violation':null,
  college:'SEAL University',avatarUrl:null,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

const mTm = Array.from({length:50},(_,i)=>({
  id:`tm-${i+1}`,name:`Team ${['Alpha','Beta','Gamma','Delta','Epsilon'][i%5]} ${i+1}`,
  canEdit:i%3!==0,isDisable:i%7===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
  members:Array.from({length:2+(i%3)},(_,j)=>({id:`mb-${i}-${j}`,userId:`us-${(i*3+j+1)}`,
    firstName:FN[(i*3+j)%10],lastName:LN[(i*3+j)%10],email:`mb${i*3+j+1}@seal.dev`,role:j===0?'Leader':'Member'})),
}))

const mNf = Array.from({length:30},(_,i)=>({
  id:`nf-${i+1}`,title:`Notif ${i+1}: ${['System Update','New Event','Deadline','Team','Announce'][i%5]}`,
  description:`Desc for notif ${i+1}.`,targetType:['Personal','Team','System'][i%3],
  status:i<24?'Sent':'Draft',
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
  sentAt:i<24?new Date(2025,i%12,(i+1)*2+1).toISOString():null,createdBy:'Admin',
}))

const mRp = Array.from({length:20},(_,i)=>({
  id:`rp-${i+1}`,title:`Report ${i+1}: ${['Bug','Feature','Content','User','Other'][i%5]}`,
  description:`Desc for report ${i+1}.`,status:['Pending','Reviewed','Resolved'][i%3],
  typeReport:['Bug','Feature','Content','User','Other'][i%5],
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
  reportedBy:`us-${(i%10)+1}`,
}))

const mRd = Array.from({length:60},(_,i)=>({
  id:`rd-${i+1}`,eventId:`ev-${(i%10)+1}`,
  name:`Round ${(i%4)+1}: ${['Ideation','Prototype','Final','Judging'][i%4]}`,
  roundNo:(i%4)+1,description:`Desc for round ${i+1}`,
  startTime:new Date(2025,i%12,(i+1)*3).toISOString(),endTime:new Date(2025,i%12,(i+1)*3+5).toISOString(),
  startSubmission:new Date(2025,i%12,(i+1)*3).toISOString(),endSubmission:new Date(2025,i%12,(i+1)*3+4).toISOString(),
  limitTeam:5,isDisable:i%9===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

const mTr = Array.from({length:30},(_,i)=>({
  id:`tr-${i+1}`,eventId:`ev-${(i%5)+1}`,
  name:`${['Web','Mobile','AI/ML','Blockchain','Cloud'][i%5]} Track`,
  description:`Desc for track ${i+1}`,isDisable:i%7===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

const mTp = Array.from({length:40},(_,i)=>({
  id:`tp-${i+1}`,trackId:`tr-${(i%5)+1}`,
  name:`${['Healthcare','Finance','Education','Gaming','Green'][i%5]} Topic ${i+1}`,
  description:`Desc for topic ${i+1}`,isDisable:i%8===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

const mAw = Array.from({length:15},(_,i)=>({
  id:`aw-${i+1}`,eventId:`ev-${(i%3)+1}`,
  name:`${['1st','2nd','3rd','Innovation','Design'][i%5]} Award ${i+1}`,
  description:`Award desc ${i+1}`,prize:`$${(i+1)*5000}`,isDisable:i%6===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

const mAs = Array.from({length:20},(_,i)=>({
  id:`as-${i+1}`,eventId:`ev-${(i%8)+1}`,userId:`us-${(i%15)+1}`,
  eventRole:['Staff','Mentor','Judge'][i%3],isDisable:i%10===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
  user:{id:`us-${(i%15)+1}`,email:`user${(i%15)+1}@seal.dev`,firstName:FN[(i%15)%10],lastName:LN[(i%15)%10],role:'Staff'},
  event:{id:`ev-${(i%8)+1}`,name:mEv[i%45]?.name||`Event ${i+1}`},
}))

const mRT = Array.from({length:30},(_,i)=>({
  id:`rt-${i+1}`,eventId:`ev-${(i%5)+1}`,teamId:`tm-${(i%10)+1}`,
  teamName:mTm[i%50]?.name||`Team ${i+1}`,
  trackId:`tr-${(i%5)+1}`,trackName:mTr[i%30]?.name||`Track ${i+1}`,
  topicId:`tp-${(i%8)+1}`,topicName:mTp[i%40]?.name||`Topic ${i+1}`,
  status:['Pending','Approved','Rejected'][i%3],isDisable:i%9===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

const mSb = Array.from({length:40},(_,i)=>({
  id:`sb-${i+1}`,eventId:`ev-${(i%5)+1}`,roundId:`rd-${(i%10)+1}`,
  registerTeamId:`rt-${(i%10)+1}`,teamName:mTm[i%50]?.name||`Team ${i+1}`,
  trackName:mTr[i%30]?.name||`Track ${i+1}`,
  status:['Submitted','Grading','Graded'][i%3],
  submittedAt:new Date(2025,i%12,(i+1)*3).toISOString(),
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
  fileUrls:[`https://example.com/sub-${i+1}.pdf`],
}))

const mCT = Array.from({length:20},(_,i)=>({
  id:`ct-${i+1}`,roundId:`rd-${(i%5)+1}`,
  name:`${['Technical','Creativity','Impact','Presentation'][i%4]} Template`,
  description:`CT desc ${i+1}`,isActive:i%3===0,isDisable:i%7===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

const mCI = Array.from({length:50},(_,i)=>({
  id:`ci-${i+1}`,templateId:`ct-${(i%10)+1}`,
  name:`${['Code Quality','Innovation','Scalability','UI/UX','Docs'][i%5]} ${i+1}`,
  description:`CI desc ${i+1}`,maxScore:10+(i%5)*5,weight:1+(i%3),isDisable:i%11===0,
  createdAt:new Date(2025,i%12,(i+1)*2).toISOString(),updatedAt:new Date(2025,i%12,(i+1)*2+1).toISOString(),
}))

// ============================ COUNTS ============================

export async function getEventsCount(status) {
  await d(); const t = status ? mEv.filter(e=>e.status===status&&!e.isDisable).length : mEv.filter(e=>!e.isDisable).length
  return {total:t}
}
export async function getUsersCount(role) {
  await d(); const t = role ? mUs.filter(u=>u.role===role&&!u.isDisable).length : mUs.filter(u=>!u.isDisable).length
  return {total:t}
}
export async function getTeamsCount(isDisable) {
  await d(); const t = isDisable!==undefined ? mTm.filter(t=>t.isDisable===isDisable).length : mTm.length
  return {total:t}
}
export async function getRecentEvents() { await d(); return {events:mEv.slice(0,5)} }
export async function getRecentUsers() { await d(); return {users:mUs.slice(0,5)} }
export async function getRecentNotifications() { await d(); return {notifications:mNf.filter(n=>n.status==='Sent').slice(0,5)} }
export async function getRecentReports() { await d(); return {reports:mRp.slice(0,5)} }

// ============================ EVENTS ============================

export async function getEvents(params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=[...mEv]
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(e=>e.name.toLowerCase().includes(k))}
  if(params.Status) l=l.filter(e=>e.status===params.Status)
  if(params.IsDisable!==undefined) l=l.filter(e=>e.isDisable===params.IsDisable)
  return {events:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getEventDetail(eventId) { await d(); const e=mEv.find(e=>e.id===eventId); if(!e) throw new Error('Not found'); return {...e} }
export async function createEvent(payload) { await d(); return {data:{id:`ev-${mEv.length+1}`,...payload},message:'Created'} }
export async function updateEvent(eventId,payload) { await d(); return {message:'Updated'} }
export async function deleteEvent(eventId) { await d(); return {message:'Deleted'} }
export async function restoreEvent(eventId) { await d(); return {message:'Restored'} }

// ============================ USERS ============================

export async function getUsers(params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=[...mUs]
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(u=>u.email.toLowerCase().includes(k)||u.firstName.toLowerCase().includes(k)||u.lastName.toLowerCase().includes(k))}
  if(params.Role) l=l.filter(u=>u.role===params.Role)
  if(params.IsDisable!==undefined) l=l.filter(u=>u.isDisable===params.IsDisable)
  if(params.IsVerified!==undefined) l=l.filter(u=>u.isVerified===params.IsVerified)
  return {users:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getUserDetail(userId) { await d(); const u=mUs.find(u=>u.id===userId); if(!u) throw new Error('Not found'); return {...u} }
export async function getUserEvents(userId,params={}) { await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; const ue=mEv.filter((_,i)=>(i+parseInt(userId.split('-')[1]||'1'))%3===0); return {events:pg(ue,pi,ps).data,totalCount:ue.length,pageIndex:pi,pageSize:ps} }
export async function createUser(payload) { await d(); return {data:{id:`us-${mUs.length+1}`,...payload}} }
export async function updateUser(userId,formData) { await d(); return {message:'Updated'} }
export async function deleteUser(userId) { await d(); return {message:'Deleted'} }
export async function restoreUser(userId) { await d(); return {message:'Restored'} }
export async function banUser(userId,banReason) { await d(); return {message:'Banned'} }
export async function unbanUser(userId) { await d(); return {message:'Unbanned'} }

// ============================ TEAMS ============================

export async function getTeams(params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=[...mTm]
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(t=>t.name.toLowerCase().includes(k))}
  if(params.CanEdit!==undefined) l=l.filter(t=>t.canEdit===params.CanEdit)
  if(params.IsDisable!==undefined) l=l.filter(t=>t.isDisable===params.IsDisable)
  return {teams:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getTeamDetail(teamId) { await d(); const t=mTm.find(t=>t.id===teamId); if(!t) throw new Error('Not found'); return {...t} }
export async function deleteTeam(teamId) { await d(); return {message:'Deleted'} }
export async function restoreTeam(teamId) { await d(); return {message:'Restored'} }
export async function lockTeam(teamId) { await d(); return {message:'Locked'} }
export async function unlockTeam(teamId) { await d(); return {message:'Unlocked'} }
export async function updateTeam(teamId,payload) { await d(); return {message:'Updated'} }

// ============================ NOTIFICATIONS ============================

export async function getNotifications(params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=[...mNf]
  if(params.Title){const k=params.Title.toLowerCase();l=l.filter(n=>n.title.toLowerCase().includes(k))}
  if(params.TargetType) l=l.filter(n=>n.targetType===params.TargetType)
  return {notifications:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getNotificationDetail(notifId) { await d(); const n=mNf.find(n=>n.id===notifId); if(!n) throw new Error('Not found'); return {...n} }
export async function createNotification(payload) { await d(); return {data:{id:`nf-${mNf.length+1}`,...payload},message:'Created'} }
export async function updateNotification(notifId,payload) { await d(); return {message:'Updated'} }
export async function deleteNotification(notifId) { await d(); return {message:'Deleted'} }

// ============================ REPORTS ============================

export async function getReports(params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=[...mRp]
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(r=>r.title.toLowerCase().includes(k)||r.description.toLowerCase().includes(k))}
  if(params.Status) l=l.filter(r=>r.status===params.Status)
  if(params.TypeReport) l=l.filter(r=>r.typeReport===params.TypeReport)
  return {reports:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getReportDetail(reportId) { await d(); const r=mRp.find(r=>r.id===reportId); if(!r) throw new Error('Not found'); return {...r} }
export async function resolveReport(reportId,{resolution}) { await d(); return {message:'Resolved'} }

// ============================ ROUNDS ============================

export async function getRounds(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mRd.filter(r=>r.eventId===eventId)
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(r=>r.name.toLowerCase().includes(k))}
  if(params.RoundNo) l=l.filter(r=>r.roundNo===params.RoundNo)
  if(params.IsDisable!==undefined) l=l.filter(r=>r.isDisable===params.IsDisable)
  return {rounds:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getRoundDetail(roundId) { await d(); const r=mRd.find(r=>r.id===roundId); if(!r) throw new Error('Not found'); return {...r} }
export async function createRound(eventId,payload) { await d(); return {message:'Created'} }
export async function updateRound(roundId,payload) { await d(); return {message:'Updated'} }
export async function deleteRound(roundId) { await d(); return {message:'Deleted'} }
export async function restoreRound(roundId) { await d(); return {message:'Restored'} }
export async function getMaxRoundNo(eventId) { await d(); const rs=mRd.filter(r=>r.eventId===eventId); return rs.length>0?Math.max(...rs.map(r=>r.roundNo)):null }
export async function swapRounds(eventId,roundId,targetRoundNo) { await d(); return {message:'Swapped'} }

// ============================ TRACKS ============================

export async function getTracks(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mTr.filter(t=>t.eventId===eventId)
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(t=>t.name.toLowerCase().includes(k))}
  if(params.IsDisable!==undefined) l=l.filter(t=>t.isDisable===params.IsDisable)
  return {tracks:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getTrackDetail(eventId,trackId) { await d(); const t=mTr.find(t=>t.id===trackId&&t.eventId===eventId); if(!t) throw new Error('Not found'); return {...t} }
export async function createTrack(eventId,payload) { await d(); return {message:'Created'} }
export async function updateTrack(eventId,trackId,payload) { await d(); return {message:'Updated'} }
export async function deleteTrack(eventId,trackId) { await d(); return {message:'Deleted'} }
export async function restoreTrack(eventId,trackId) { await d(); return {message:'Restored'} }

// ============================ TOPICS ============================

export async function getTopics(trackId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mTp.filter(t=>t.trackId===trackId)
  return {topics:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getTopicDetail(topicId) { await d(); const t=mTp.find(t=>t.id===topicId); if(!t) throw new Error('Not found'); return {...t} }
export async function createTopic(trackId,payload) { await d(); return {message:'Created'} }
export async function updateTopic(topicId,payload) { await d(); return {message:'Updated'} }
export async function deleteTopic(topicId) { await d(); return {message:'Deleted'} }
export async function restoreTopic(topicId) { await d(); return {message:'Restored'} }

// ============================ AWARDS ============================

export async function getAwards(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mAw.filter(a=>a.eventId===eventId)
  if(params.IsDisable!==undefined) l=l.filter(a=>a.isDisable===params.IsDisable)
  return {awards:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getAwardDetail(eventId,awardId) { await d(); const a=mAw.find(a=>a.id===awardId&&a.eventId===eventId); if(!a) throw new Error('Not found'); return {...a} }
export async function createAward(eventId,payload) { await d(); return {message:'Created'} }
export async function updateAward(eventId,awardId,payload) { await d(); return {message:'Updated'} }
export async function deleteAward(eventId,awardId) { await d(); return {message:'Deleted'} }
export async function restoreAward(eventId,awardId) { await d(); return {message:'Restored'} }

// ============================ CRITERIA TEMPLATES ============================

export async function getCriteriaTemplates(roundId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mCT.filter(c=>c.roundId===roundId)
  if(params.IsDisable!==undefined) l=l.filter(c=>c.isDisable===params.IsDisable)
  return {criteriaTemplates:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getCriteriaTemplateDetail(templateId) { await d(); const ct=mCT.find(c=>c.id===templateId); if(!ct) throw new Error('Not found'); return {...ct} }
export async function createCriteriaTemplate(roundId,payload) { await d(); return {message:'Created'} }
export async function updateCriteriaTemplate(templateId,payload) { await d(); return {message:'Updated'} }
export async function deleteCriteriaTemplate(templateId) { await d(); return {message:'Deleted'} }
export async function restoreCriteriaTemplate(templateId) { await d(); return {message:'Restored'} }
export async function activateCriteriaTemplate(templateId) { await d(); return {message:'Activated'} }

// ============================ CRITERIA ITEMS ============================

export async function getCriteriaItems(templateId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mCI.filter(c=>c.templateId===templateId)
  if(params.IsDisable!==undefined) l=l.filter(c=>c.isDisable===params.IsDisable)
  return {criteriaItems:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getCriteriaItemDetail(itemId) { await d(); const ci=mCI.find(c=>c.id===itemId); if(!ci) throw new Error('Not found'); return {...ci} }
export async function createCriteriaItem(templateId,payload) { await d(); return {message:'Created'} }
export async function updateCriteriaItem(itemId,payload) { await d(); return {message:'Updated'} }
export async function deleteCriteriaItem(itemId) { await d(); return {message:'Deleted'} }
export async function restoreCriteriaItem(itemId) { await d(); return {message:'Restored'} }

// ============================ ASSIGNS ============================

export async function getEventAssigns(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mAs.filter(a=>a.eventId===eventId)
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(a=>a.user?.firstName?.toLowerCase().includes(k)||a.user?.email?.toLowerCase().includes(k))}
  if(params.IsDisable!==undefined) l=l.filter(a=>a.isDisable===params.IsDisable)
  return {eventAssigns:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getAvailableStaff(eventId,params={}) {
  await d(); const assigned=mAs.filter(a=>a.eventId===eventId&&!a.isDisable).map(a=>a.userId)
  const available=mUs.filter(u=>(u.role==='Staff'||u.role==='Lecturer')&&!assigned.includes(u.id)&&!u.isDisable)
  return {users:available,totalCount:available.length}
}
export async function assignUserToEvent(eventId,payload) { await d(); return {message:'Assigned'} }
export async function removeAssign(assignEventId) { await d(); return {message:'Removed'} }
export async function restoreAssign(assignEventId) { await d(); return {message:'Restored'} }
export async function assignTrackToEventAssign(assignEventId,payload) { await d(); return {message:'Track assigned'} }
export async function removeTrackFromAssign(assignEventId,trackId) { await d(); return {message:'Track removed'} }
export async function restoreTrackToAssign(assignEventId,trackId) { await d(); return {message:'Track restored'} }

// ============================ REGISTER TEAMS ============================

export async function getRegisterTeams(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mRT.filter(rt=>rt.eventId===eventId)
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(rt=>rt.teamName.toLowerCase().includes(k))}
  if(params.Status) l=l.filter(rt=>rt.status===params.Status)
  if(params.IsDisable!==undefined) l=l.filter(rt=>rt.isDisable===params.IsDisable)
  return {registerTeams:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getRegisterTeamDetail(registerTeamId) { await d(); const rt=mRT.find(r=>r.id===registerTeamId); if(!rt) throw new Error('Not found'); return {...rt} }
export async function updateRegisterTeam(registerTeamId,payload) { await d(); return {message:'Updated'} }
export async function assignRegisterTeamToNextRound(registerTeamId) { await d(); return {data:{registerTeamId,roundId:'rd-1',roundName:'Next',roundNo:2},message:'Assigned'} }
export async function revertRegisterTeamToPreviousRound(registerTeamId) { await d(); return {data:{registerTeamId},message:'Reverted'} }
export async function getRegisterTeamSubmissions(registerTeamId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mSb.filter(s=>s.registerTeamId===registerTeamId)
  return {submissions:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}

// ============================ SUBMISSIONS ============================

export async function getEventSubmissions(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mSb.filter(s=>s.eventId===eventId)
  if(params.roundId) l=l.filter(s=>s.roundId===params.roundId)
  if(params.topicId) l=l.filter(s=>s.registerTeamId&&mRT.find(rt=>rt.id===s.registerTeamId&&rt.topicId===params.topicId))
  if(params.keyword){const k=params.keyword.toLowerCase();l=l.filter(s=>s.teamName?.toLowerCase().includes(k))}
  return {submissions:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getSubmissionDetail(submissionId) { await d(); const s=mSb.find(s=>s.id===submissionId); if(!s) throw new Error('Not found'); return {...s} }
export async function getSubmissionGraderScores(submissionId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10
  const scores=[{id:'sc-1',submissionId,graderName:'Grader A',totalScore:85,maxScore:100,createdAt:new Date().toISOString()},{id:'sc-2',submissionId,graderName:'Grader B',totalScore:78,maxScore:100,createdAt:new Date().toISOString()}]
  return {graderScores:pg(scores,pi,ps).data,totalCount:scores.length,pageIndex:pi,pageSize:ps}
}
export async function getScoreDetail(scoreId) { await d(); return {id:scoreId,graderName:'Grader',totalScore:85,maxScore:100} }
export async function getScoreItems(scoreId,params={}) { await d(); return {scoreItems:[],totalCount:0} }
export async function getScoreItemDetail(scoreItemId) { await d(); return {id:scoreItemId,name:'Score Item',score:10,maxScore:10} }

// ============================ PROFILE ============================

export async function getAdminProfile() {
  await d(); return {id:'st-1',email:'staff@seal.dev',firstName:'Staff',lastName:'Member',role:'Staff',college:'SEAL University',avatarUrl:null}
}
export async function updateProfile(formData) { await d(); return {message:'Profile updated'} }

// ============================ MISSING FUNCTIONS ============================

export async function getAssignedUsers(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mAs.filter(a=>a.eventId===eventId&&!a.isDisable)
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(a=>a.user?.firstName?.toLowerCase().includes(k)||a.user?.email?.toLowerCase().includes(k))}
  return {eventAssigns:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function getAvailableLecturers(eventId,params={}) {
  await d(); return {users:mUs.filter(u=>u.role==='Lecturer'&&!u.isDisable).slice(0,10),totalCount:10}
}
export async function getEventRegisterTeams(eventId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mRT.filter(rt=>rt.eventId===eventId)
  if(params.Keyword){const k=params.Keyword.toLowerCase();l=l.filter(rt=>rt.teamName.toLowerCase().includes(k))}
  if(params.Status) l=l.filter(rt=>rt.status===params.Status)
  if(params.IsDisable!==undefined) l=l.filter(rt=>rt.isDisable===params.IsDisable)
  return {registerTeams:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function approveRegisterTeam(registerTeamId) { await d(); return {message:'Approved'} }
export async function rejectRegisterTeam(registerTeamId) { await d(); return {message:'Rejected'} }
export async function banRegisterTeam(registerTeamId) { await d(); return {message:'Banned'} }
export async function unbanRegisterTeam(registerTeamId) { await d(); return {message:'Unbanned'} }
export async function assignTrackTopicToRegisterTeam(registerTeamId,payload) { await d(); return {message:'Track/Topic assigned'} }
export async function removeTrackTopicFromRegisterTeam(registerTeamId) { await d(); return {message:'Track/Topic removed'} }
export async function getTeamRegisterHistory(teamId,params={}) {
  await d(); const pi=params.PageIndex||1,ps=params.PageSize||10; let l=mRT.filter(rt=>rt.teamId===teamId)
  return {registerTeams:pg(l,pi,ps).data,totalCount:l.length,pageIndex:pi,pageSize:ps}
}
export async function updateReportStatus(reportId,payload) { await d(); return {message:'Status updated'} }
export async function swapAward(eventId,awardId,targetAwardId) { await d(); return {message:'Swapped'} }
export async function restoreNotification(notifId) { await d(); return {message:'Restored'} }
export async function getEventLeaderboard(eventId, params = {}) {
  await d(); const pi = params.PageIndex || 1; const ps = params.PageSize || 10
  return {
    eventId, eventName: `Hackathon ${eventId}`,
    totalRounds: Math.floor(Math.random() * 3) + 1,
    items: pg(
      Array.from({ length: 30 }, (_, i) => ({
        rank: i + 1,
        registerTeamId: `rt-${(i % 10) + 1}`,
        teamId: `tm-${(i % 20) + 1}`,
        teamName: mTm[i % 20]?.name || `Team ${i + 1}`,
        trackId: `tr-${(i % 15) + 1}`,
        trackTitle: `Track ${(i % 15) + 1}`,
        topicId: i % 3 ? `tp-${(i % 5) + 1}` : null,
        topicTitle: i % 3 ? `Topic ${(i % 5) + 1}` : null,
        eventScore: Math.round((95 - i * 2.5 + Math.random() * 3) * 100) / 100,
        roundScores: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
          roundNo: j + 1,
          roundName: `Round ${j + 1}`,
          scopeScore: Math.round((90 - i * 3 + j * 2 + Math.random() * 5) * 100) / 100,
        })),
      })),
      pi, ps
    ).data,
    totalCount: 30, pageIndex: pi, pageSize: ps,
  }
}
