import { useCallback, useState } from 'react'
import CommentInput from './CommentInput'
import { Avatar } from 'primereact/avatar'
import { CommentDTO } from '../../types/type'

const CommentsItem = ({ loadingState, userId, comment, parent, handleAddComment, handleDeleteComment }:
    {
        loadingState: boolean,
        userId: number | null,
        comment: CommentDTO,
        parent: CommentDTO | null,
        handleAddComment: (content: string, parentId?: number) => void,
        handleDeleteComment: (commentId: number) => void
    }) => {
    const [reply, setReply] = useState(false)

    const isChildButNotLastOnLevel = useCallback((): boolean => {
        if (!parent) return false
        if (comment.id === parent.children[parent.children.length - 1].id) return false
        return true
    }, [comment.id, parent])

    return (
        <div className={`p-2 pl-3 pr-0`}>
            {/* {isChildButNotLastOnLevel() && <div className="absolute bg-gray-300" style={{ width: '2px', height: '100%',  }}></div>} */}
            <div className="relative">
          
                <div className="flex gap-2 align-items-center">
                    <Avatar icon="pi pi-user" size="normal" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />
                    <div className='flex flex-column gap-1'>
                        <b>{comment.username}</b>
                        <small className='text-400'>{comment.createdAt}</small>
                    </div>
                </div>
                
                <div className={`ml-3 `}>

                    <div className='ml-3 mt-2' style={{ backgroundColor: "#f1f3f5", padding: "10px", borderRadius: "8px", width: 'fit-content' }}>
                        {comment.content}
                    </div>
                    <div>
                        {reply && (
                            <CommentInput
                                loadingState={loadingState}
                                parentId={comment.id}
                                handleAddComment={handleAddComment}
                            />
                        )}
                        <a className='cursor-pointer p-button p-button-rounded p-button-sm p-button-text p-button-secondary'
                            onClick={() => setReply(!reply)}
                        >
                            {reply ? 'Cancel' : 'Reply'}
                        </a>
                        {userId === comment.userId && (
                            <a className='cursor-pointer p-button p-button-rounded p-button-sm p-button-text p-button-danger'
                                onClick={() => handleDeleteComment(comment.id)}
                            >
                                Delete
                            </a>
                        )}

                    </div>

                </div>
            </div>

            <div className='flex flex-column pl-4'>
                {comment.children.map((child, index) => (
                    <CommentsItem
                        key={index}
                        loadingState={loadingState}
                        userId={userId}
                        comment={child}
                        parent={comment}
                        handleAddComment={handleAddComment}
                        handleDeleteComment={handleDeleteComment}
                    />
                ))}
            </div>
        </div>
    )
}

export default CommentsItem