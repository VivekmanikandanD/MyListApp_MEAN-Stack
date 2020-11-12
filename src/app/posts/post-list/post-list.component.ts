import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from 'rxjs';
import { AuthDataService } from "src/app/auth/auth-data.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  pageLength: number = 3;
  pageSize: number = 2;
  pageSizeOptions: number[] = [1, 2, 5];
  currentPage: number = 1;
  userId: string;
  private postsSub: Subscription;
  public isLoggedIn =false;


  constructor(public postsService: PostsService, private authDataService:AuthDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.userId = this.authDataService.getUserId();
    this.postsSub =
      this.postsService.getPostUpdateListener().
      subscribe((response: { posts: Post[], totalPostCount: number }) => {
        this.isLoading = false;
        this.posts = response.posts;
        this.pageLength = response.totalPostCount;
      });
     this.authDataService.getAuthStatusListener().subscribe(result => {
      this.isLoggedIn =result;
      this.userId = this.authDataService.getUserId();
     });
     this.isLoggedIn =this.authDataService.getLoggedInStatus();
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    },error => {
      this.isLoading = false;
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
