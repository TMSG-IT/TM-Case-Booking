import React, { useState, useEffect } from 'react';
import { CaseStatus } from '../types';
import { getStatusColor } from './CasesList/utils';

const StatusLegend: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1366);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1366);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statusList: { status: CaseStatus; description: string }[] = [
    { status: 'Case Booked', description: 'Initial case submission' },
    { status: 'Order Preparation', description: 'Processing order details' },
    { status: 'Order Prepared', description: 'Ready for sales approval' },
    { status: 'Sales Approval', description: 'Sales team approval required' },
    { status: 'Pending Delivery (Hospital)', description: 'Pending hospital delivery' },
    { status: 'Delivered (Hospital)', description: 'Delivered to hospital' },
    { status: 'Case Completed', description: 'Surgery completed' },
    { status: 'Pending Delivery (Office)', description: 'Pending office delivery' },
    { status: 'Delivered (Office)', description: 'Equipment returned to office' },
    { status: 'To be billed', description: 'Ready for billing' },
    { status: 'Case Closed', description: 'Case finalized and closed' },
    { status: 'Case Cancelled', description: 'Case cancelled' }
  ];

  return (
    <>
      <button
        className={`status-legend-button ${isMobile ? 'mobile-menu-item' : ''}`}
        onClick={() => setShowPopup(true)}
      >
        <span className={isMobile ? 'mobile-menu-icon' : ''}>📊</span>
        <span>Status Colors</span>
      </button>

      {showPopup && (
        <div className="status-legend-overlay" onClick={() => setShowPopup(false)}>
          <div className="status-legend-popup" onClick={(e) => e.stopPropagation()}>
            <div className="legend-header">
              <h3>Status Color Legend</h3>
              <button
                className="close-button"
                onClick={() => setShowPopup(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="legend-content">
              <div className="legend-grid">
                {statusList.map(({ status, description }) => (
                  <div key={status} className="legend-item">
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(status) }}
                    ></div>
                    <div className="status-info">
                      <span className="status-name">{status}</span>
                      <span className="status-description">{description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusLegend;