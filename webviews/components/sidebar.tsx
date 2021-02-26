/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React, { useContext, useState } from 'react';
import { ILabel } from '../../src/github/interface';
import { PullRequest } from '../common/cache';
import PullRequestContext from '../common/context';
import { AuthorLink, Avatar } from '../components/user';
import { deleteIcon, plusIcon } from './icon';
import { Reviewer } from './reviewer';
import { nbsp } from './space';

export default function Sidebar({ reviewers, labels, hasWritePermission, isIssue, milestone, assignees }: PullRequest) {
	const { addReviewers, addLabels, updatePR, pr } = useContext(PullRequestContext);

	return (
		<div id="sidebar">
			{!isIssue ? (
				<div id="reviewers" className="section">
					<div className="section-header">
						<div>Reviewers</div>
						{hasWritePermission ? (
							<button
								title="Add Reviewers"
								onClick={async () => {
									const newReviewers = await addReviewers();
									updatePR({ reviewers: pr.reviewers.concat(newReviewers.added) });
								}}
							>
								{plusIcon}
							</button>
						) : null}
					</div>
					{reviewers
						? reviewers.map(state => (
								<Reviewer key={state.reviewer.login} {...state} canDelete={hasWritePermission} />
						  ))
						: []}
				</div>
			) : (
				''
			)}
			<div id="assignes" className="section">
				<div className="section-header">
					<div>Assignees</div>
				</div>
				{assignees
					? assignees.map((x, i) => {
							return (
								<div key={i} className="section-item reviewer">
									<Avatar for={x} />
									<AuthorLink for={x} />
								</div>
							);
					  })
					: null}
			</div>
			<div id="labels" className="section">
				<div className="section-header">
					<div>Labels</div>
					{hasWritePermission ? (
						<button
							title="Add Labels"
							onClick={async () => {
								const newLabels = await addLabels();
								updatePR({ labels: pr.labels.concat(newLabels.added) });
							}}
						>
							{plusIcon}
						</button>
					) : null}
				</div>
				{labels.map(label => (
					<Label key={label.name} {...label} canDelete={hasWritePermission} />
				))}
			</div>
			<div id="milestone" className="section">
				<div className="section-header">
					<div>Milestone</div>
				</div>
				{milestone ? <div className="section-item label">{milestone.title}</div> : null}
			</div>
		</div>
	);
}

function Label(label: ILabel & { canDelete: boolean }) {
	const { name, canDelete } = label;
	const [showDelete, setShowDelete] = useState(false);
	const { removeLabel } = useContext(PullRequestContext);
	return (
		<div
			className="section-item label"
			onMouseEnter={() => setShowDelete(true)}
			onMouseLeave={() => setShowDelete(false)}
		>
			{name}
			{canDelete && showDelete ? (
				<>
					{nbsp}
					<a className="push-right remove-item" onClick={() => removeLabel(name)}>
						{deleteIcon}️
					</a>
					{nbsp}
				</>
			) : null}
		</div>
	);
}
