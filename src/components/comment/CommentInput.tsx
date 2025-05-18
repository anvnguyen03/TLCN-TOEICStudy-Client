import { FormEvent, useState } from 'react'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'

const CommentInput = ({
    loadingState,
    parentId,
    handleAddComment,
}: {
    loadingState: boolean
    parentId?: number
    handleAddComment: (content: string, parentId?: number) => void
}) => {
    const [value, setValue] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 300) {
            setValue(e.target.value)
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const comment = value
        if (!comment || comment.trim() === '') return alert('Comment is required')

        handleAddComment(comment, parentId)
        setValue('')
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-column p-2'>
                <i className='text-gray-400 mb-1'>*{value.length}/300 kí tự</i>
                <div className="flex align-items-center gap-2">
                    <InputTextarea
                        disabled={loadingState}
                        autoResize
                        placeholder="Let's share your thought here..."
                        maxLength={300}
                        value={value}
                        onChange={handleChange}
                        rows={1} cols={60} />
                    <Button type="submit" severity='contrast' size='small' loading={loadingState}>Submit</Button>
                </div>
            </form>
        </div>
    )
}

export default CommentInput