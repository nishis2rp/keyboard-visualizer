const HistoryList = ({ history }) => {
  return (
    <div className="history">
      <div className="history-title">履歴</div>
      <div className="history-list">
        {history.length === 0 ? (
          <p className="instruction">ショートカットの履歴がここに表示されます</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-combo">{item.combo}</div>
              {item.description && (
                <div className="history-description">{item.description}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HistoryList
