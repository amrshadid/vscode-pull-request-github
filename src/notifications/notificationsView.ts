/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { IssueModel } from '../github/issueModel';
import { PullRequestModel } from '../github/pullRequestModel';
import { NotificationsProvider, ResolvedNotification, } from './notificationsProvider';

export class NotificationsTreeData implements vscode.TreeDataProvider<ResolvedNotification> {
	private _onDidChangeTreeData: vscode.EventEmitter<ResolvedNotification | undefined | void> = new vscode.EventEmitter<ResolvedNotification | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ResolvedNotification | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private readonly _notificationsProvider: NotificationsProvider) { }

	async getTreeItem(element: ResolvedNotification): Promise<vscode.TreeItem> {
		const label = element.priority !== undefined ? `${element.priority}% - ${element.subject.title}` : element.subject.title;
		const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);

		if (element.subject.type === 'Issue' && element.model instanceof IssueModel) {
			item.iconPath = element.model.isOpen
				? new vscode.ThemeIcon('issues', new vscode.ThemeColor('issues.open'))
				: new vscode.ThemeIcon('issue-closed', new vscode.ThemeColor('issues.closed'));

		}
		if (element.subject.type === 'PullRequest' && element.model instanceof PullRequestModel) {
			item.iconPath = element.model.isOpen
				? new vscode.ThemeIcon('git-pull-request', new vscode.ThemeColor('pullRequests.open'))
				: new vscode.ThemeIcon('git-pull-request', new vscode.ThemeColor('pullRequests.merged'));
		}
		item.description = `${element.repository.owner.login}/${element.repository.name}`;
		item.contextValue = element.subject.type;

		return item;
	}

	async getChildren(element?: unknown): Promise<ResolvedNotification[] | undefined> {
		if (element !== undefined) {
			return undefined;
		}

		const result = await this._notificationsProvider.getNotifications();
		return result;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}