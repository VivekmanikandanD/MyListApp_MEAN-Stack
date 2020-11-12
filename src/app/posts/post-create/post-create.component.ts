import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { mimeType } from './mime-type.validator'
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { AuthDataService } from "src/app/auth/auth-data.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  isLoading = false;
  form: FormGroup
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;
  public post: Post;
  imagePreview: string;
  constructor(public postsService: PostsService, public route: ActivatedRoute,private authDataService:AuthDataService ) { }

  ngOnInit() {
    this.authStatusSub = this.authDataService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = authStatus;
    })
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { asyncValidators: [mimeType] })
    });
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('postId')) {
        this.mode = "edit";
        this.postId = param.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postObj => {
          this.isLoading = false;
          this.post = {
            id: postObj._id,
            title: postObj.title,
            content: postObj.content,
            imagePath: postObj.imagePath,
            createdBy: postObj.createdBy
          };
          this.imagePreview = postObj.imagePath;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create"
        this.postId = null;
        this.isLoading = false;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
  }

  onSavePost() {
    this.form.get('image').setValidators(Validators.required);
    this.form.get('image').updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    this.mode === 'create' ?
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image) :
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
