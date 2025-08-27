/**
 * CaseDetails Component - Detailed case information display
 * Extracted from the massive CaseCard component
 */

import React from 'react';
import { CaseDetailsProps } from './types';
import { useCaseData } from './hooks/useCaseData';
import { useUserNames } from '../../hooks/useUserNames';

const CaseDetails: React.FC<CaseDetailsProps> = ({
  caseItem,
  isExpanded,
  onToggleExpansion
}) => {
  const {
    formattedSubmissionDate,
    formattedProcessedDate,
    daysSinceSubmission,
    daysUntilSurgery,
    displaySets: _displaySets, // eslint-disable-line @typescript-eslint/no-unused-vars
    displayImplants: _displayImplants, // eslint-disable-line @typescript-eslint/no-unused-vars
    hasAmendments,
    amendmentInfo
  } = useCaseData(caseItem);

  // Get user IDs that need to be resolved to names
  const userIds = [
    caseItem.submittedBy,
    caseItem.processedBy,
    caseItem.amendedBy
  ].filter((id): id is string => Boolean(id));

  const { getUserName } = useUserNames(userIds);


  if (!isExpanded) return null;

  return (
    <div className="case-details">
      {/* Case Information Grid */}
      <div className="case-info-grid">
        <div className="case-info-item">
          <span className="case-info-label">Department</span>
          <span className="case-info-value">{caseItem.department}</span>
        </div>

        <div className="case-info-item">
          <span className="case-info-label">Procedure Type</span>
          <span className="case-info-value">{caseItem.procedureType}</span>
        </div>

        <div className="case-info-item">
          <span className="case-info-label">Procedure Name</span>
          <span className="case-info-value">{caseItem.procedureName}</span>
        </div>

        <div className="case-info-item">
          <span className="case-info-label">Time of Procedure</span>
          <span className="case-info-value">{caseItem.timeOfProcedure || 'Not specified'}</span>
        </div>

        <div className="case-info-item">
          <span className="case-info-label">Submitted By</span>
          <span className="case-info-value">{getUserName(caseItem.submittedBy)}</span>
        </div>

        <div className="case-info-item">
          <span className="case-info-label">Submitted Date</span>
          <span className="case-info-value">{formattedSubmissionDate}</span>
        </div>

        {formattedProcessedDate && (
          <div className="case-info-item">
            <span className="case-info-label">Processed Date</span>
            <span className="case-info-value">{formattedProcessedDate}</span>
          </div>
        )}

        {caseItem.processedBy && (
          <div className="case-info-item">
            <span className="case-info-label">Processed By</span>
            <span className="case-info-value">{getUserName(caseItem.processedBy)}</span>
          </div>
        )}
      </div>

      {/* Surgery Sets and Implants */}
      <div className="case-equipment-section">
        <div className="equipment-group">
          <h4 className="equipment-title">Surgery Set Selection</h4>
          <div className="equipment-list">
            {caseItem.surgerySetSelection?.length ? (
              <div className="equipment-items">
                {caseItem.surgerySetSelection.map((set, index) => (
                  <span key={index} className="equipment-tag">
                    {set}
                  </span>
                ))}
              </div>
            ) : (
              <span className="no-equipment">No surgery sets selected</span>
            )}
          </div>
        </div>

        <div className="equipment-group">
          <h4 className="equipment-title">Implant Box Selection</h4>
          <div className="equipment-list">
            {caseItem.implantBox?.length ? (
              <div className="equipment-items">
                {caseItem.implantBox.map((implant, index) => (
                  <span key={index} className="equipment-tag">
                    {implant}
                  </span>
                ))}
              </div>
            ) : (
              <span className="no-equipment">No implant boxes selected</span>
            )}
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      {caseItem.specialInstruction && (
        <div className="special-instructions">
          <h4 className="instructions-title">Special Instructions</h4>
          <div className="instructions-content">
            {caseItem.specialInstruction}
          </div>
        </div>
      )}

      {/* Process Order Details */}
      {caseItem.processOrderDetails && (
        <div className="process-details">
          <h4 className="process-title">Order Processing Details</h4>
          <div className="process-content">
            {caseItem.processOrderDetails}
          </div>
        </div>
      )}

      {/* Amendment Information */}
      {hasAmendments && amendmentInfo && (
        <div className="amendment-info">
          <h4 className="amendment-title">Amendment Information</h4>
          <div className="amendment-details">
            <span className="amendment-by">Amended by: {getUserName(amendmentInfo.amendedBy || '')}</span>
            <span className="amendment-date">Date: {amendmentInfo.amendedAt}</span>
          </div>
        </div>
      )}

      {/* Case Submission Information */}
      <div className="submission-info">
        <div className="submission-item">
          <span className="submission-label">Submitted by:</span>
          <span className="submission-value">{getUserName(caseItem.submittedBy) || 'Unknown User'}</span>
        </div>
        {formattedSubmissionDate && (
          <div className="submission-item">
            <span className="submission-label">Submitted on:</span>
            <span className="submission-value">{formattedSubmissionDate}</span>
          </div>
        )}
        {caseItem.processedBy && (
          <div className="submission-item">
            <span className="submission-label">Last processed by:</span>
            <span className="submission-value">{getUserName(caseItem.processedBy) || 'Unknown User'}</span>
          </div>
        )}
        {formattedProcessedDate && (
          <div className="submission-item">
            <span className="submission-label">Last processed on:</span>
            <span className="submission-value">{formattedProcessedDate}</span>
          </div>
        )}
      </div>

      {/* Timeline Information */}
      <div className="case-timeline">
        <div className="timeline-item">
          <span className="timeline-label">Days since submission:</span>
          <span className="timeline-value">{daysSinceSubmission} days</span>
        </div>
        <div className="timeline-item">
          <span className="timeline-label">Days until surgery:</span>
          <span className={`timeline-value ${daysUntilSurgery <= 2 ? 'urgent' : ''}`}>
            {daysUntilSurgery > 0 ? `${daysUntilSurgery} days` : 'Past due'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CaseDetails);