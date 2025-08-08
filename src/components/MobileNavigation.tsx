import React from 'react';
import { User } from '../types';
import { hasPermission, PERMISSION_ACTIONS } from '../utils/permissions';
import '../assets/components/MobileNavigation.css';

type ActivePage = 'booking' | 'cases' | 'process' | 'users' | 'sets' | 'reports' | 'calendar' | 'permissions' | 'codetables' | 'audit-logs' | 'email-config' | 'backup-restore' | 'data-import' | 'system-settings';

interface MobileNavigationProps {
  user: User;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onLogout: () => void;
}

interface NavItem {
  id: ActivePage;
  label: string;
  icon: string;
  permission: string;
  primary?: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  user, 
  activePage, 
  onNavigate,
  onLogout
}) => {
  const closeMenu = () => {
    const checkbox = document.getElementById('mobile-menu-toggle') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  };

  const handleMenuNavigate = (page: ActivePage) => {
    onNavigate(page);
    closeMenu();
  };

  const handleLogout = () => {
    onLogout();
    closeMenu();
  };
  // Primary navigation items (bottom bar)
  const primaryNavItems: NavItem[] = [
    {
      id: 'booking',
      label: 'New Case',
      icon: '📝',
      permission: PERMISSION_ACTIONS.CREATE_CASE,
      primary: true
    },
    {
      id: 'cases',
      label: 'Cases',
      icon: '📋',
      permission: PERMISSION_ACTIONS.VIEW_CASES,
      primary: true
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      permission: PERMISSION_ACTIONS.BOOKING_CALENDAR,
      primary: true
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📊',
      permission: PERMISSION_ACTIONS.VIEW_REPORTS,
      primary: true
    }
  ];

  // Filter nav items based on permissions
  const getVisibleNavItems = (items: NavItem[]) => {
    return items.filter(item => hasPermission(user.role, item.permission));
  };

  const visiblePrimaryItems = getVisibleNavItems(primaryNavItems);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <div className="mobile-nav-container">
          {visiblePrimaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          ))}
          
          {/* More/Menu button for additional features */}
          <div className="mobile-nav-more">
            <input type="checkbox" id="mobile-menu-toggle" className="mobile-menu-toggle" />
            <label htmlFor="mobile-menu-toggle" className="mobile-nav-item mobile-more-btn">
              <span className="mobile-nav-icon">⋯</span>
              <span className="mobile-nav-label">More</span>
              <div className="mobile-user-preview">
                <span className="mobile-user-preview-name">{user.name}</span>
                <span className="mobile-user-preview-role">{user.role.toUpperCase()}</span>
                {user.selectedCountry && (
                  <span className="mobile-user-preview-country">📍 {user.selectedCountry}</span>
                )}
              </div>
            </label>
            
            {/* Expandable menu */}
            <div className="mobile-menu-overlay">
              <div className="mobile-menu-content">
                <div className="mobile-menu-header">
                  <div className="mobile-user-info">
                    <div className="mobile-user-detail">
                      <span className="mobile-detail-label">Name:</span>
                      <span className="mobile-user-name">{user.name}</span>
                    </div>
                    <div className="mobile-user-detail">
                      <span className="mobile-detail-label">Role:</span>
                      <span className={`mobile-user-role ${user.role}`}>
                        {user.role.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    {user.selectedCountry && (
                      <div className="mobile-user-detail">
                        <span className="mobile-detail-label">Country:</span>
                        <span className="mobile-country-badge">
                          📍 {user.selectedCountry}
                        </span>
                      </div>
                    )}
                  </div>
                  <label htmlFor="mobile-menu-toggle" className="mobile-menu-close">×</label>
                </div>
                
                <div className="mobile-menu-section">
                  <h3>Tools</h3>
                  {hasPermission(user.role, PERMISSION_ACTIONS.EDIT_SETS) && (
                    <button
                      onClick={() => handleMenuNavigate('sets')}
                      className={`mobile-menu-item ${activePage === 'sets' ? 'active' : ''}`}
                    >
                      <span className="mobile-menu-icon">⚙️</span>
                      Edit Sets
                    </button>
                  )}
                </div>

                {(hasPermission(user.role, PERMISSION_ACTIONS.VIEW_USERS) || 
                  hasPermission(user.role, PERMISSION_ACTIONS.SYSTEM_SETTINGS) ||
                  hasPermission(user.role, PERMISSION_ACTIONS.CODE_TABLE_SETUP)) && (
                  <div className="mobile-menu-section">
                    <h3>Administration</h3>
                    {hasPermission(user.role, PERMISSION_ACTIONS.SYSTEM_SETTINGS) && (
                      <button
                        onClick={() => handleMenuNavigate('system-settings')}
                        className={`mobile-menu-item ${activePage === 'system-settings' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">⚙️</span>
                        System Settings
                      </button>
                    )}
                    {hasPermission(user.role, PERMISSION_ACTIONS.VIEW_USERS) && (
                      <button
                        onClick={() => handleMenuNavigate('users')}
                        className={`mobile-menu-item ${activePage === 'users' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">👥</span>
                        User Management
                      </button>
                    )}
                    {hasPermission(user.role, PERMISSION_ACTIONS.CODE_TABLE_SETUP) && (
                      <button
                        onClick={() => handleMenuNavigate('codetables')}
                        className={`mobile-menu-item ${activePage === 'codetables' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">📊</span>
                        Code Tables
                      </button>
                    )}
                    {hasPermission(user.role, PERMISSION_ACTIONS.PERMISSION_MATRIX) && (
                      <button
                        onClick={() => handleMenuNavigate('permissions')}
                        className={`mobile-menu-item ${activePage === 'permissions' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">🔐</span>
                        Permissions
                      </button>
                    )}
                    {hasPermission(user.role, PERMISSION_ACTIONS.EMAIL_CONFIG) && (
                      <button
                        onClick={() => handleMenuNavigate('email-config')}
                        className={`mobile-menu-item ${activePage === 'email-config' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">📧</span>
                        Email Config
                      </button>
                    )}
                    {hasPermission(user.role, PERMISSION_ACTIONS.AUDIT_LOGS) && (
                      <button
                        onClick={() => handleMenuNavigate('audit-logs')}
                        className={`mobile-menu-item ${activePage === 'audit-logs' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">📊</span>
                        Audit Logs
                      </button>
                    )}
                    {hasPermission(user.role, PERMISSION_ACTIONS.BACKUP_RESTORE) && (
                      <button
                        onClick={() => handleMenuNavigate('backup-restore')}
                        className={`mobile-menu-item ${activePage === 'backup-restore' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">💾</span>
                        Backup & Restore
                      </button>
                    )}
                    {hasPermission(user.role, PERMISSION_ACTIONS.IMPORT_DATA) && (
                      <button
                        onClick={() => handleMenuNavigate('data-import')}
                        className={`mobile-menu-item ${activePage === 'data-import' ? 'active' : ''}`}
                      >
                        <span className="mobile-menu-icon">📥</span>
                        Data Import
                      </button>
                    )}
                  </div>
                )}

                <div className="mobile-menu-section">
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <span className="mobile-menu-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;