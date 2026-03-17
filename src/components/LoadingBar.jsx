export default function LoadingBar({ visible }) {
  return <div className={`loading-bar${visible ? '' : ' loading-bar-hidden'}`} />
}
