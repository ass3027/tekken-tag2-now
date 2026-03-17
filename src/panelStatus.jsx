export function panelStatus(loading, error, loadingMsg) {
  if (loading) return <div className="panel"><p className="state-msg px-4">{loadingMsg}</p></div>
  if (error)   return <div className="panel"><p className="state-msg error px-4">Error: {error}</p></div>
  return null
}
